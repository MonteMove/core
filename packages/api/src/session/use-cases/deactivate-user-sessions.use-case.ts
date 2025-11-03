import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { DeactivateUserSessionsOutput } from '../types';

@Injectable()
export class DeactivateUserSessionsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    userId: string,
    excludeSessionId?: string,
  ): Promise<DeactivateUserSessionsOutput> {
    const where: Prisma.SessionWhereInput = {
      userId,
      revoked: false,
    };

    if (excludeSessionId) {
      where.id = { not: excludeSessionId };
    }

    const updateResult = await this.prisma.session.updateMany({
      where,
      data: {
        revoked: true,
      },
    });

    return {
      message: 'Сессии пользователя успешно деактивированы',
      deactivatedCount: updateResult.count,
    };
  }
}
