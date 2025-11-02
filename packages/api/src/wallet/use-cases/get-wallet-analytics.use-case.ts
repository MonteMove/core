import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { GetWalletAnalyticsDto } from '../dto';
import { GetWalletAnalyticsOutput, WalletAnalyticsItem } from '../types';

@Injectable()
export class GetWalletAnalyticsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getWalletAnalyticsDto: GetWalletAnalyticsDto): Promise<GetWalletAnalyticsOutput> {
        const { walletId, currency, holder, dateStart, dateEnd, includeDeleted, includeCash, includeVisa } =
            getWalletAnalyticsDto;

        const walletFilters: Prisma.WalletWhereInput = {
            deleted: includeDeleted ? undefined : false,
        };

        if (walletId) {
            walletFilters.id = walletId;
        }

        if (currency) {
            walletFilters.currency = { code: currency };
        }

        if (holder) {
            walletFilters.created_by = {
                username: {
                    contains: holder,
                    mode: 'insensitive',
                },
            };
        }

        if (!includeCash || !includeVisa) {
            const excludePatterns: string[] = [];

            if (!includeCash) {
                excludePatterns.push('касса', 'наличные', 'нал');
            }

            if (!includeVisa) {
                excludePatterns.push('внж');
            }

            if (excludePatterns.length > 0) {
                walletFilters.AND = excludePatterns.map((pattern) => ({
                    name: {
                        not: {
                            contains: pattern,
                            mode: 'insensitive' as const,
                        },
                    },
                }));
            }
        }

        const wallets = await this.prisma.wallet.findMany({
            where: walletFilters,
            include: {
                currency: {
                    select: {
                        code: true,
                    },
                },
                created_by: {
                    select: {
                        username: true,
                    },
                },
                details: true,
            },
        });

        const analyticsItems: WalletAnalyticsItem[] = await Promise.all(
            wallets.map(async (wallet) => {
                const operationEntryFilter: Prisma.OperationEntryWhereInput = {
                    walletId: wallet.id,
                    operation: {
                        deleted: false,
                    },
                };

                if (dateStart || dateEnd) {
                    const dateFilter: Prisma.DateTimeFilter = {};

                    if (dateStart) {
                        dateFilter.gte = new Date(dateStart);
                    }

                    if (dateEnd) {
                        dateFilter.lte = new Date(dateEnd);
                    }

                    operationEntryFilter.operation = {
                        deleted: false,
                        createdAt: dateFilter,
                    };
                }

                const operationEntries = await this.prisma.operationEntry.findMany({
                    where: operationEntryFilter,
                    include: {
                        operation: {
                            select: {
                                createdAt: true,
                            },
                        },
                    },
                });

                let coming = 0;
                let expenditure = 0;
                let lastOperationDate: Date | null = null;

                operationEntries.forEach((entry) => {
                    if (entry.direction === 'credit') {
                        coming += entry.amount;
                    } else {
                        expenditure += entry.amount;
                    }

                    if (!lastOperationDate || entry.operation.createdAt > lastOperationDate) {
                        lastOperationDate = entry.operation.createdAt;
                    }
                });

                const netFlow = coming - expenditure;
                const operationsCount = operationEntries.length;

                return {
                    walletId: wallet.id,
                    walletName: wallet.name || '',
                    walletCurrency: wallet.currency.code,
                    holder: wallet.created_by?.username || null,
                    currentBalance: wallet.amount,
                    coming,
                    expenditure,
                    netFlow,
                    operationsCount,
                };
            }),
        );

        const totalWallets = analyticsItems.length;
        const totalBalance = analyticsItems.reduce((sum, item) => sum + item.currentBalance, 0);
        const totalComing = analyticsItems.reduce((sum, item) => sum + item.coming, 0);
        const totalExpenditure = analyticsItems.reduce((sum, item) => sum + item.expenditure, 0);
        const totalNetFlow = totalComing - totalExpenditure;
        const totalOperations = analyticsItems.reduce((sum, item) => sum + item.operationsCount, 0);

        const currencyBreakdown = analyticsItems.reduce(
            (acc, item) => {
                if (!acc[item.walletCurrency]) {
                    acc[item.walletCurrency] = 0;
                }
                acc[item.walletCurrency] += item.currentBalance;

                return acc;
            },
            {} as Record<string, number>,
        );

        return {
            message: 'Аналитика кошельков успешно получена',
            analytics: analyticsItems,
            summary: {
                totalWallets,
                totalBalance,
                totalComing,
                totalExpenditure,
                totalNetFlow,
                totalOperations,
                currencyBreakdown,
            },
        };
    }
}
