import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class NetworkTypeInitService implements OnModuleInit {
    private readonly logger = new Logger(NetworkTypeInitService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit() {
        setTimeout(() => {
            this.initializeNetworkTypes();
        }, 1000);
    }

    private async initializeNetworkTypes() {
        const networkTypes = [
            { networkCode: 'tron', code: 'trc-20', name: 'TRC-20' },
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
            this.logger.warn('Админ пользователь не найден. Пропускаем инициализацию типов сетей.');
            return;
        }

        for (const typeData of networkTypes) {
            const network = await this.prisma.network.findFirst({
                where: {
                    code: typeData.networkCode,
                    deleted: false,
                },
            });

            if (!network) {
                this.logger.warn(`Сеть ${typeData.networkCode} не найдена. Пропускаем ${typeData.name}`);
                continue;
            }

            const existing = await this.prisma.networkType.findFirst({
                where: {
                    networkId: network.id,
                    code: typeData.code,
                    deleted: false,
                },
            });

            if (!existing) {
                await this.prisma.networkType.create({
                    data: {
                        code: typeData.code,
                        name: typeData.name,
                        networkId: network.id,
                        userId: adminUser.id,
                        updatedById: adminUser.id,
                    },
                });
                this.logger.log(`Создан тип сети: ${typeData.name} (${typeData.networkCode})`);
            }
        }
    }
}
