import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class PlatformInitService implements OnModuleInit {
    private readonly logger = new Logger(PlatformInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit() {
        await this.initializePlatforms();
    }

    private async initializePlatforms() {
        const platforms = [
            {
                code: 'bybit',
                name: 'Bybit',
            },
            {
                code: 'trust',
                name: 'Trust Wallet',
            },
            {
                code: 'metamask',
                name: 'MetaMask',
            },
            {
                code: 'binance',
                name: 'Binance',
            },
            {
                code: 'okx',
                name: 'OKX',
            },
        ];

        // Получаем админ пользователя
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
            this.logger.warn('Админ пользователь не найден. Пропускаем инициализацию платформ.');
            return;
        }

        for (const platformData of platforms) {
            const existing = await this.prisma.platform.findUnique({
                where: { code: platformData.code },
            });

            if (!existing) {
                await this.prisma.platform.create({
                    data: {
                        ...platformData,
                        userId: adminUser.id,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Создана платформа: ${platformData.name}`);
            }
        }
    }
}
