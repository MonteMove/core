import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RoleCode } from '../../prisma/generated/prisma';
import { BcryptHasher } from '../common/services/bcrypt-hasher.service';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class AdminInitService {
    private readonly logger = new Logger(AdminInitService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly bcryptHasher: BcryptHasher,
        private readonly configService: ConfigService,
    ) {}

    public async createInitialAdmin(): Promise<void> {
        try {
            await this.createInitialRoles();

            const adminUsername = this.configService.getOrThrow<string>('ADMIN_USERNAME');
            const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

            if (!adminUsername || !adminPassword) {
                this.logger.warn('ADMIN_USERNAME ил ADMIN_PASSWORD не предоставлены, пропуск создания админа');

                return;
            }

            const existingAdmin = await this.prisma.user.findFirst({
                where: {
                    roles: {
                        some: {
                            code: RoleCode.admin,
                            deleted: false,
                        },
                    },
                    deleted: false,
                },
            });

            if (existingAdmin) {
                this.logger.log('Админ пользователь уже существует, пропуск создания');

                return;
            }

            const existingUser = await this.prisma.user.findUnique({
                where: { username: adminUsername },
            });

            if (existingUser) {
                this.logger.warn(`Пользователь с username "${adminUsername}" уже существует, пропуск создания`);

                return;
            }

            const adminRole = await this.prisma.role.findFirst({
                where: {
                    code: RoleCode.admin,
                    deleted: false,
                },
            });

            if (!adminRole) {
                this.logger.error('Роль админа не найдена в базе данных');

                return;
            }

            const passwordHash = await this.bcryptHasher.hash(adminPassword);

            const adminUser = await this.prisma.user.create({
                data: {
                    username: adminUsername,
                    passwordHash,
                    roles: {
                        connect: { id: adminRole.id },
                    },
                },
                include: {
                    roles: true,
                },
            });

            this.logger.log(`Админ пользователь успешно создан: ${adminUser.username}`);
        } catch (error) {
            this.logger.error('Ошибка при создании админ пользователя:', error);
        }
    }

    private async createInitialRoles(): Promise<void> {
        try {
            this.logger.log('Инициализация ролей...');

            const rolesToCreate = [
                { code: RoleCode.admin, name: 'Администратор' },
                { code: RoleCode.moderator, name: 'Модератор' },
                { code: RoleCode.user, name: 'Пользователь' },
            ];

            for (const roleData of rolesToCreate) {
                const existingRole = await this.prisma.role.findFirst({
                    where: {
                        code: roleData.code,
                        deleted: false,
                    },
                });

                if (!existingRole) {
                    await this.prisma.role.create({
                        data: {
                            code: roleData.code,
                            name: roleData.name,
                        },
                    });

                    this.logger.log(`Роль "${roleData.name}" (${roleData.code}) создана`);
                } else {
                    this.logger.log(`Роль "${roleData.name}" (${roleData.code}) уже существует`);
                }
            }

            this.logger.log('Инициализация ролей завершена');
        } catch (error) {
            this.logger.error('Ошибка при создании ролей:', error);
            throw error;
        }
    }
}
