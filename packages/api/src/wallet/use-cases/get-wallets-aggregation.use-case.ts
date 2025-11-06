import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { GetWalletsDto } from '../dto';
import { GetWalletsAggregationOutput } from '../types';

@Injectable()
export class GetWalletsAggregationUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getWalletsDto: GetWalletsDto): Promise<GetWalletsAggregationOutput> {
        const {
            search,
            balanceStatus,
            walletKind,
            walletTypeId,
            walletTypeIdIsNull,
            minAmount,
            maxAmount,
            currencyId,
            userId,
            active,
            pinOnMain,
            pinned,
            visible,
            deleted,
        } = getWalletsDto;

        const where: Prisma.WalletWhereInput = {};

        if (deleted !== undefined) {
            where.deleted = deleted;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (balanceStatus !== undefined) {
            where.balanceStatus = balanceStatus;
        }

        if (walletKind !== undefined) {
            where.walletKind = walletKind;
        }

        if (walletTypeId !== undefined) {
            where.walletTypeId = walletTypeId;
        }

        if (walletTypeIdIsNull === true) {
            where.walletTypeId = null;
        }

        if (minAmount !== undefined || maxAmount !== undefined) {
            where.amount = {};
            if (minAmount !== undefined) {
                where.amount.gte = minAmount;
            }
            if (maxAmount !== undefined) {
                where.amount.lte = maxAmount;
            }
        }

        if (currencyId) {
            where.currencyId = currencyId;
        }

        if (userId) {
            where.userId = userId;
        }

        if (active !== undefined) {
            where.active = active;
        }

        if (pinOnMain !== undefined) {
            where.pinOnMain = pinOnMain;
        }

        if (pinned !== undefined) {
            where.pinned = pinned;
        }

        if (visible !== undefined) {
            where.visible = visible;
        }

        const wallets = await this.prisma.wallet.findMany({
            where,
            select: {
                amount: true,
                currency: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
            },
        });

        const currencyMap = new Map<
            string,
            {
                currency: { id: string; code: string; name: string };
                totalAmount: number;
                walletsCount: number;
            }
        >();

        wallets.forEach((wallet) => {
            const currencyId = wallet.currency.id;

            if (!currencyMap.has(currencyId)) {
                currencyMap.set(currencyId, {
                    currency: wallet.currency,
                    totalAmount: 0,
                    walletsCount: 0,
                });
            }

            const group = currencyMap.get(currencyId)!;
            group.totalAmount += wallet.amount;
            group.walletsCount += 1;
        });

        const currencyGroups = Array.from(currencyMap.values());

        return {
            currencyGroups,
        };
    }
}
