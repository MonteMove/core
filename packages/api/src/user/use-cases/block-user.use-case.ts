import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { BlockUserDto } from '../dto';
import { UpdateUserOutput } from '../types';

@Injectable()
export class BlockUserUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(userId: string, blockUserDto: BlockUserDto): Promise<UpdateUserOutput> {
        const { blocked } = blockUserDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser || existingUser.deleted) {
            throw new NotFoundException('Пользователь не найден');
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                blocked,
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

        const message = blocked ? 'Пользователь успешно заблокирован' : 'Пользователь успешно разблокирован';

        return {
            message,
            user: userResponse,
        };
    }
}
