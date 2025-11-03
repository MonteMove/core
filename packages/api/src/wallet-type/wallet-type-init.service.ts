import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class WalletTypeInitService implements OnModuleInit {
  private readonly logger = new Logger(WalletTypeInitService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeWalletTypes();
  }

  private async initializeWalletTypes() {
    const walletTypes = [
      {
        code: 'inskech',
        name: 'Инскеш',
        description: 'Кошельки для работы с Инскеш',
        showInTabs: true,
        tabOrder: 1,
        color: '#3B82F6',
        icon: 'wallet',
      },
      {
        code: 'bet11',
        name: 'Bet11',
        description: 'Кошельки для работы с Bet11',
        showInTabs: true,
        tabOrder: 2,
        color: '#10B981',
        icon: 'wallet',
      },
      {
        code: 'vnj',
        name: 'ВНЖ',
        description: 'Кошельки для ВНЖ',
        showInTabs: true,
        tabOrder: 3,
        color: '#F59E0B',
        icon: 'wallet',
      },
    ];

    for (const typeData of walletTypes) {
      const existing = await this.prisma.walletType.findUnique({
        where: { code: typeData.code },
      });

      if (!existing) {
        await this.prisma.walletType.create({
          data: typeData,
        });
        this.logger.log(`Создан тип кошелька: ${typeData.name}`);
      }
    }
  }
}
