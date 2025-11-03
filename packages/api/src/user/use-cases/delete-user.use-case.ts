import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteUserOutput } from '../types';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(userId: string): Promise<DeleteUserOutput> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser || existingUser.deleted) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deleted: true,
      },
    });

    return {
      message: 'Пользователь успешно удалён',
    };
  }
}
