import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { OPERATION_TYPE_CODES } from './constants/operation-type.constants';

@Injectable()
export class OperationTypeInitService implements OnModuleInit {
    private readonly logger = new Logger(OperationTypeInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    public async onModuleInit() {
        await this.initializeOperationTypes();
    }

    private async initializeOperationTypes() {
        const adminUser = await this.prisma.user.findFirst({
            where: {
                roles: {
                    some: {
                        code: 'admin',
                        deleted: false,
                    },
                },
                deleted: false,
            },
        });

        if (!adminUser) {
            this.logger.warn('Админ пользователь не найден, пропуск инициализации типов операций');

            return;
        }

        const operationTypes = [
            {
                code: OPERATION_TYPE_CODES.AVANS,
                name: 'Аванс',
                description: 'Аванс',
                isSeparateTab: true,
            },
            {
                code: OPERATION_TYPE_CODES.CORRECTION,
                name: 'Корректировка',
                description: 'Корректировка баланса кошелька',
                isSeparateTab: false,
            },
            {
                code: OPERATION_TYPE_CODES.CONVERSION,
                name: 'Конвертация',
                description: 'Конвертация валюты',
                isSeparateTab: false,
            },
        ];

        for (const typeData of operationTypes) {
            const existing = await this.prisma.operationType.findUnique({
                where: {
                    code: typeData.code,
                },
            });

            if (!existing) {
                await this.prisma.operationType.create({
                    data: {
                        ...typeData,
                        userId: adminUser.id,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Создан тип операции: ${typeData.name}`);
            } else if (existing.isSeparateTab !== typeData.isSeparateTab) {
                await this.prisma.operationType.update({
                    where: { id: existing.id },
                    data: {
                        isSeparateTab: typeData.isSeparateTab,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Обновлен тип операции: ${typeData.name} (isSeparateTab: ${typeData.isSeparateTab})`);
            }
        }
    }
}
