import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetWalletByIdOutput } from '../types';
import { mapWalletToResponse, WalletWithRelations } from '../utils/wallet.mapper';

@Injectable()
export class GetWalletByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(walletId: string): Promise<GetWalletByIdOutput> {
        const wallet = (await this.prisma.wallet.findUnique({
            where: { id: walletId },
            include: {
                created_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                updated_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                currency: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                details: {
                    select: {
                        id: true,
                        phone: true,
                        card: true,
                        ownerFullName: true,
                        address: true,
                        accountId: true,
                        username: true,
                        exchangeUid: true,
                        network: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                        networkType: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        })) as WalletWithRelations | null;

        if (!wallet || wallet.deleted) {
            throw new NotFoundException('Кошелек не найден');
        }

        return {
            wallet: mapWalletToResponse(wallet),
        };
    }
}
