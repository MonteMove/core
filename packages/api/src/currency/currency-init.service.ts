import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class CurrencyInitService implements OnModuleInit {
    private readonly logger = new Logger(CurrencyInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    public async onModuleInit() {
        await this.initializeCurrencies();
    }

    private async initializeCurrencies() {
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
            this.logger.warn('Админ пользователь не найден, пропуск инициализации валют');

            return;
        }

        const currencies = [
            { code: 'RUB', name: 'Российский рубль' },
            { code: 'EUR', name: 'Евро' },
        ];

        for (const currencyData of currencies) {
            const existing = await this.prisma.currency.findFirst({
                where: {
                    code: currencyData.code,
                    deleted: false,
                },
            });

            if (!existing) {
                await this.prisma.currency.create({
                    data: {
                        ...currencyData,
                        userId: adminUser.id,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Создана валюта: ${currencyData.name} (${currencyData.code})`);
            }
        }
    }
}
