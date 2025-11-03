import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetUserByIdOutput } from '../types';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(userId: string): Promise<GetUserByIdOutput> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user || user.deleted) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { deleted: _, passwordHash: __, ...userResponse } = user;

    return {
      user: userResponse,
    };
  }
}
