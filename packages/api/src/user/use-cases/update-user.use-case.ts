import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { BcryptHasher } from '../../common/services/bcrypt-hasher.service';
import { PrismaService } from '../../common/services/prisma.service';
import { UpdateUserDto } from '../dto';
import { UpdateUserOutput } from '../types';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        private readonly prisma: PrismaService,
        private readonly bcryptHasher: BcryptHasher,
    ) {}

    public async execute(userId: string, updateUserDto: UpdateUserDto): Promise<UpdateUserOutput> {
        const { username, telegramId, blocked, telegramNotifications, password, roleIds } = updateUserDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser || existingUser.deleted) {
            throw new NotFoundException('Пользователь не найден');
        }

        if (username && username !== existingUser.username) {
            const userWithUsername = await this.prisma.user.findUnique({
                where: { username },
            });

            if (userWithUsername && !userWithUsername.deleted) {
                throw new ConflictException('Пользователь с таким именем уже существует');
            }
        }

        if (telegramId && telegramId !== existingUser.telegramId) {
            const userWithTelegramId = await this.prisma.user.findUnique({
                where: { telegramId },
            });

            if (userWithTelegramId && !userWithTelegramId.deleted) {
                throw new ConflictException('Пользователь с таким Telegram ID уже существует');
            }
        }

        let passwordHash: string | undefined;

        if (password) {
            passwordHash = await this.bcryptHasher.hash(password);
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(username !== undefined && { username }),
                ...(telegramId !== undefined && { telegramId }),
                ...(blocked !== undefined && { blocked }),
                ...(telegramNotifications !== undefined && { telegramNotifications }),
                ...(passwordHash !== undefined && { passwordHash }),
                ...(roleIds !== undefined && {
                    roles: {
                        set: roleIds.map((roleId) => ({ id: roleId })),
                    },
                }),
            },
            include: {
                roles: {
                    where: { deleted: false },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });

        const { deleted: _, passwordHash: __, ...userResponse } = user;

        return {
            message: 'Пользователь успешно обновлён',
            user: userResponse,
        };
    }
}
