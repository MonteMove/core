import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common';
import { WalletRecalculationService } from '../../wallet/services';
import { CreateOperationDto } from '../dto';
import { CreateOperationResponse } from '../types';

@Injectable()
export class CreateOperationUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly walletRecalculationService: WalletRecalculationService,
    ) {}

    public async execute(createOperationDto: CreateOperationDto, userId: string): Promise<CreateOperationResponse> {
        const { typeId, description, conversionGroupId, entries, applicationId, creatureDate } = createOperationDto;

        return this.prisma.$transaction(async (tx) => {
            // Получаем тип операции для проверки специальной логики
            const operationType = await tx.operationType.findUnique({
                where: { id: typeId },
                select: { name: true },
            });

            // Валидация и обработка для типа "Корректировка"
            if (operationType?.name === 'Корректировка') {
                if (entries.length !== 1) {
                    throw new BadRequestException(
                        'Операция "Корректировка" должна содержать ровно одну запись (один кошелек)',
                    );
                }

                // Для корректировки: amount - это желаемый баланс, нужно вычислить разницу
                const entry = entries[0];
                const currentBalance = await this.walletRecalculationService.getCalculatedWalletAmount(
                    tx,
                    entry.walletId,
                );
                const desiredBalance = entry.amount;
                const difference = desiredBalance - currentBalance;

                // Обновляем amount на разницу и устанавливаем правильное направление
                if (difference > 0) {
                    entry.amount = difference;
                    entry.direction = 'credit';
                } else if (difference < 0) {
                    entry.amount = Math.abs(difference);
                    entry.direction = 'debit';
                } else {
                    throw new BadRequestException(
                        'Баланс кошелька уже равен указанному значению. Корректировка не требуется.',
                    );
                }
            }

            // Проверка месячных лимитов для всех кошельков в операции
            for (const entry of entries) {
                const wallet = await tx.wallet.findUnique({
                    where: { id: entry.walletId },
                    select: {
                        id: true,
                        name: true,
                        monthlyLimit: true,
                        currency: {
                            select: {
                                code: true,
                            },
                        },
                    },
                });

                if (!wallet) {
                    throw new BadRequestException(`Кошелек с ID ${entry.walletId} не найден`);
                }

                // Если у кошелька установлен месячный лимит, проверяем его
                if (wallet.monthlyLimit && wallet.monthlyLimit > 0) {
                    // Определяем границы текущего месяца
                    const now = new Date();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

                    // Получаем сумму всех операций за текущий месяц
                    const monthlyEntries = await tx.operationEntry.findMany({
                        where: {
                            walletId: entry.walletId,
                            deleted: false,
                            createdAt: {
                                gte: startOfMonth,
                                lt: endOfMonth,
                            },
                        },
                        select: {
                            amount: true,
                        },
                    });

                    const currentSpent = monthlyEntries.reduce((sum, e) => sum + e.amount, 0);
                    const remaining = wallet.monthlyLimit - currentSpent;

                    // Проверяем, не превысит ли новая операция лимит
                    if (entry.amount > remaining) {
                        throw new BadRequestException(
                            `Превышен месячный лимит кошелька "${wallet.name}". ` +
                                `Доступно: ${remaining.toLocaleString('ru-RU')} ${wallet.currency.code}, ` +
                                `требуется: ${entry.amount.toLocaleString('ru-RU')} ${wallet.currency.code}`,
                        );
                    }
                }
            }

            const operation = await tx.operation.create({
                data: {
                    userId,
                    updatedById: userId,
                    typeId,
                    ...(applicationId && { applicationId }),
                    description,
                    conversionGroupId,
                    createdAt: creatureDate,
                },
            });

            for (const entry of entries) {
                await tx.operationEntry.create({
                    data: {
                        userId,
                        updatedById: userId,
                        operationId: operation.id,
                        walletId: entry.walletId,
                        direction: entry.direction,
                        amount: entry.amount,
                    },
                });
            }

            await this.walletRecalculationService.recalculateForOperation(tx, operation.id, userId);

            if (applicationId) {
                const appId = typeof applicationId === 'string' ? parseInt(applicationId, 10) : applicationId;

                await tx.application.update({
                    where: { id: appId },
                    data: {
                        operationId: operation.id,
                        updatedById: userId,
                    },
                });
            }

            const createdOperation = await tx.operation.findUnique({
                where: { id: operation.id },
                include: {
                    entries: {
                        where: { deleted: false },
                        select: {
                            id: true,
                            walletId: true,
                            direction: true,
                            amount: true,
                            before: true,
                            after: true,
                            userId: true,
                            updatedById: true,
                            createdAt: true,
                            updatedAt: true,
                            wallet: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    type: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    created_by: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    updated_by: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });

            const { deleted: _, ...operationResponse } = createdOperation!;

            return {
                message: 'Операция успешно создана',
                operation: operationResponse,
            };
        });
    }
}
