import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { RestoreCurrencyOutput } from '../types';

@Injectable()
export class RestoreCurrencyUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    currencyId: string,
    restoredById: string,
  ): Promise<RestoreCurrencyOutput> {
    const currency = await this.prisma.currency.findUnique({
      where: { id: currencyId },
    });

    if (!currency) {
      throw new NotFoundException('Валюта не найдена');
    }

    if (!currency.deleted) {
      throw new NotFoundException('Валюта не удалена');
    }

    await this.prisma.currency.update({
      where: { id: currencyId },
      data: {
        deleted: false,
        updatedById: restoredById,
      },
    });

    return {
      message: 'Валюта успешно восстановлена',
    };
  }
}
