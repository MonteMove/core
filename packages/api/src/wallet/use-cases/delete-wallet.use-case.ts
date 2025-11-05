import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteWalletOutput } from '../types';

@Injectable()
export class DeleteWalletUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(walletId: string, deletedById: string): Promise<DeleteWalletOutput> {
        const existingWallet = await this.prisma.wallet.findUnique({
            where: { id: walletId },
        });

        if (!existingWallet || existingWallet.deleted) {
            throw new NotFoundException('Кошелек не найден');
        }

        await this.prisma.wallet.update({
            where: { id: walletId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Кошелек успешно удален',
        };
    }
}
