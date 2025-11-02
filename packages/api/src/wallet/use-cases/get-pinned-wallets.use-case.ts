import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { WalletResponseDto } from '../dto';
import { GetPinnedWalletsOutput } from '../types/use-cases';
import { mapWalletToResponse, WalletWithRelations } from '../utils/wallet.mapper';

@Injectable()
export class GetPinnedWalletsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(): Promise<GetPinnedWalletsOutput> {
        const where: Prisma.WalletWhereInput = {
            pinOnMain: true,
            deleted: false,
            visible: true,
        };

        const wallets = (await this.prisma.wallet.findMany({
            where,
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
            orderBy: [{ currency: { name: 'asc' } }, { amount: 'desc' }],
        })) as WalletWithRelations[];

        const currencyGroupsMap = new Map<string, WalletResponseDto[]>();

        wallets.forEach((wallet) => {
            const currencyCode = wallet.currency.code.toLowerCase();

            if (!currencyGroupsMap.has(currencyCode)) {
                currencyGroupsMap.set(currencyCode, []);
            }

            currencyGroupsMap.get(currencyCode)!.push(mapWalletToResponse(wallet));
        });

        const currencyGroups = Array.from(currencyGroupsMap.entries()).map(([currency, walletsGroup]) => ({
            currency,
            wallets: walletsGroup,
        }));

        return {
            currencyGroups,
            totalWallets: wallets.length,
            totalCurrencies: currencyGroups.length,
        };
    }
}
