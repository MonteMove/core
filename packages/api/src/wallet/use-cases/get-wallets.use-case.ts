import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetWalletsDto, WalletSortField } from '../dto';
import { GetWalletsOutput } from '../types';
import { mapWalletToResponse, WalletWithRelations } from '../utils/wallet.mapper';

@Injectable()
export class GetWalletsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getWalletsDto: GetWalletsDto): Promise<GetWalletsOutput> {
        const {
            search,
            balanceStatus,
            walletKind,
            walletType,
            minAmount,
            maxAmount,
            currencyId,
            userId,
            active,
            pinOnMain,
            pinned,
            visible,
            deleted = false,
            sortField = WalletSortField.CREATED_AT,
            sortOrder = 'desc',
            page = 1,
            limit = 10,
        } = getWalletsDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.WalletWhereInput = {
            deleted,
        };

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

        if (walletType !== undefined) {
            where.walletType = walletType;
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

        const total = await this.prisma.wallet.count({ where });

        const baseOptions = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
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
        };

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const wallets = (await this.prisma.wallet.findMany(findManyOptions)) as WalletWithRelations[];

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page, limit)
            : createAllDataPaginationResponse(total);

        return {
            wallets: wallets.map(mapWalletToResponse),
            pagination: paginationResponse,
        };
    }
}
