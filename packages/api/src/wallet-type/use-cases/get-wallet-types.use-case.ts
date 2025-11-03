import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { WalletTypeResponseDto } from '../dto';

@Injectable()
export class GetWalletTypesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(): Promise<{ walletTypes: WalletTypeResponseDto[] }> {
    const walletTypes = await this.prisma.walletType.findMany({
      where: { deleted: false },
      orderBy: [{ tabOrder: 'asc' }, { name: 'asc' }],
    });

    return { walletTypes };
  }
}
