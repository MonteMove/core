import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateWalletTypeDto, WalletTypeResponseDto } from '../dto';

@Injectable()
export class CreateWalletTypeUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    dto: CreateWalletTypeDto,
  ): Promise<{ message: string; walletType: WalletTypeResponseDto }> {
    const existing = await this.prisma.walletType.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Тип кошелька с кодом "${dto.code}" уже существует`,
      );
    }

    const walletType = await this.prisma.walletType.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        showInTabs: dto.showInTabs ?? false,
        tabOrder: dto.tabOrder ?? 0,
      },
    });

    return {
      message: 'Тип кошелька успешно создан',
      walletType,
    };
  }
}
