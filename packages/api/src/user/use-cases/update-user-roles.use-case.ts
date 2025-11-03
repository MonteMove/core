import { Injectable, NotFoundException } from '@nestjs/common';

import { RoleCode } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { UpdateUserRolesOutput } from '../types';

@Injectable()
export class UpdateUserRolesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    userId: string,
    roleCodes: RoleCode[],
  ): Promise<UpdateUserRolesOutput> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.deleted) {
      throw new NotFoundException('Пользователь не найден');
    }

    const uniqueRoleCodes = [...new Set(roleCodes)];

    if (uniqueRoleCodes.length > 0) {
      const roles = await this.prisma.role.findMany({
        where: {
          code: { in: uniqueRoleCodes },
          deleted: false,
        },
        select: { code: true },
      });

      if (roles.length !== uniqueRoleCodes.length) {
        throw new NotFoundException('Одна или несколько ролей не найдены');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: uniqueRoleCodes.map((code) => ({ code })),
        },
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

    const { deleted: _, passwordHash: __, ...userResponse } = updatedUser;

    return {
      message: 'Роли пользователя успешно обновлены',
      user: userResponse,
    };
  }
}
