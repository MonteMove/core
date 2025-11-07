import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class OperationTypeInitService implements OnModuleInit {
    private readonly logger = new Logger(OperationTypeInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit() {
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
                name: 'Аванс',
                description: 'Аванс',
                isSeparateTab: false,
            },
            {
                name: 'Корректировка',
                description: 'Корректировка баланса кошелька',
                isSeparateTab: false,
            },
        ];

        for (const typeData of operationTypes) {
            const existing = await this.prisma.operationType.findFirst({
                where: {
                    name: typeData.name,
                    deleted: false,
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
            }
        }
    }
}
