import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class NetworkInitService implements OnModuleInit {
    private readonly logger = new Logger(NetworkInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    public async onModuleInit() {
        await this.initializeNetworks();
    }

    private async initializeNetworks() {
        const networks = [
            {
                code: 'tron',
                name: 'TRON',
            },
        ];

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
            this.logger.warn('Админ пользователь не найден. Пропускаем инициализацию сетей.');

            return;
        }

        for (const networkData of networks) {
            const existing = await this.prisma.network.findFirst({
                where: {
                    code: networkData.code,
                    deleted: false,
                },
            });

            if (!existing) {
                await this.prisma.network.create({
                    data: {
                        ...networkData,
                        userId: adminUser.id,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Создана сеть: ${networkData.name}`);
            }
        }
    }
}
