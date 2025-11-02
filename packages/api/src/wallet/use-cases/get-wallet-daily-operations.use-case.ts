import { Injectable, NotFoundException } from '@nestjs/common';

import { OperationDirection } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { GetWalletDailyOperationsDto } from '../dto';
import {
    DailyOperationResponse,
    DailyOperationsGroup,
    GetWalletDailyOperationsOutput,
    OperationEntryWithDetails,
} from '../types';

@Injectable()
export class GetWalletDailyOperationsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(walletId: string, dto: GetWalletDailyOperationsDto): Promise<GetWalletDailyOperationsOutput> {
        const { page = 1, limit = 30, startDate, endDate } = dto;

        const wallet = await this.prisma.wallet.findFirst({
            where: {
                id: walletId,
                deleted: false,
            },
            select: {
                id: true,
                name: true,
                amount: true,
                currency: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
            },
        });

        if (!wallet) {
            throw new NotFoundException(`Кошелек с ID ${walletId} не найден`);
        }

        const dateFilter: { gte?: Date; lte?: Date } = {};

        if (startDate) {
            dateFilter.gte = new Date(startDate);
        }
        if (endDate) {
            const endDateTime = new Date(endDate);

            endDateTime.setHours(23, 59, 59, 999);
            dateFilter.lte = endDateTime;
        }

        const rawOperations = await this.prisma.operationEntry.findMany({
            where: {
                walletId,
                deleted: false,
                ...(Object.keys(dateFilter).length > 0 && {
                    createdAt: dateFilter,
                }),
            },
            select: {
                id: true,
                amount: true,
                direction: true,
                createdAt: true,
                operation: {
                    select: {
                        id: true,
                        description: true,
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
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        const allOperations: OperationEntryWithDetails[] = rawOperations.map((op) => ({
            id: op.id,
            amount: op.amount,
            direction: op.direction,
            createdAt: op.createdAt,
            description: op.operation.description,
            operationType: op.operation.type ? { name: op.operation.type.name } : null,
        }));

        const operationsByDate = this.groupOperationsByDate(allOperations);
        const dailyGroups = Array.from(operationsByDate.entries()).map(([date, operations]) => ({
            date,
            operations,
        }));

        const totalDays = dailyGroups.length;
        const totalPages = Math.ceil(totalDays / limit);
        const skip = (page - 1) * limit;
        const paginatedDays = dailyGroups.slice(skip, skip + limit);

        const dailyOperations = await this.calculateDailyBalances(paginatedDays, walletId);

        const totalOperations = allOperations.length;
        const dateRange = this.getDateRange(allOperations);
        const finalBalance = wallet.amount;
        const totalChange = this.calculateTotalChange(allOperations);

        return {
            wallet,
            dailyOperations,
            pagination: {
                total: totalDays,
                page,
                limit,
                totalPages,
            },
            summary: {
                totalOperations,
                totalDays,
                dateRange,
                finalBalance,
                totalChange,
            },
        };
    }

    private groupOperationsByDate(operations: OperationEntryWithDetails[]): Map<string, DailyOperationResponse[]> {
        const grouped = new Map<string, DailyOperationResponse[]>();

        for (const operation of operations) {
            const date = operation.createdAt.toISOString().split('T')[0];

            if (!grouped.has(date)) {
                grouped.set(date, []);
            }
            const dailyOperation: DailyOperationResponse = {
                id: operation.id,
                amount: operation.amount,
                direction: operation.direction,
                time: operation.createdAt.toISOString(),
                description: operation.description,
                operationType: operation.operationType?.name || null,
            };

            grouped.get(date)!.push(dailyOperation);
        }

        return grouped;
    }

    private async calculateDailyBalances(
        dailyGroups: { date: string; operations: DailyOperationResponse[] }[],
        walletId: string,
    ): Promise<DailyOperationsGroup[]> {
        const result: DailyOperationsGroup[] = [];

        for (const group of dailyGroups) {
            const dayStart = new Date(group.date);
            const dayStartBalance = await this.getBalanceBeforeDate(walletId, dayStart);

            let dayChange = 0;

            for (const operation of group.operations) {
                if (operation.direction === OperationDirection.credit) {
                    dayChange += operation.amount;
                } else {
                    dayChange -= operation.amount;
                }
            }

            const dayEndBalance = dayStartBalance + dayChange;

            result.push({
                date: group.date,
                operations: group.operations,
                dailyBalance: dayEndBalance,
                dailyChange: dayChange,
            });
        }

        return result;
    }

    private async getBalanceBeforeDate(walletId: string, date: Date): Promise<number> {
        const operations = await this.prisma.operationEntry.findMany({
            where: {
                walletId,
                deleted: false,
                createdAt: {
                    lt: date,
                },
            },
            select: {
                amount: true,
                direction: true,
            },
        });

        let balance = 0;

        for (const operation of operations) {
            if (operation.direction === OperationDirection.credit) {
                balance += operation.amount;
            } else {
                balance -= operation.amount;
            }
        }

        return balance;
    }

    private getDateRange(operations: OperationEntryWithDetails[]): { startDate: string; endDate: string } {
        if (operations.length === 0) {
            const today = new Date().toISOString().split('T')[0];

            return { startDate: today, endDate: today };
        }

        const dates = operations.map((op) => op.createdAt.toISOString().split('T')[0]);
        const startDate = Math.min(...dates.map((d) => new Date(d).getTime()));
        const endDate = Math.max(...dates.map((d) => new Date(d).getTime()));

        return {
            startDate: new Date(startDate).toISOString().split('T')[0],
            endDate: new Date(endDate).toISOString().split('T')[0],
        };
    }

    private calculateTotalChange(operations: OperationEntryWithDetails[]): number {
        let totalChange = 0;

        for (const operation of operations) {
            if (operation.direction === OperationDirection.credit) {
                totalChange += operation.amount;
            } else {
                totalChange -= operation.amount;
            }
        }

        return totalChange;
    }
}
