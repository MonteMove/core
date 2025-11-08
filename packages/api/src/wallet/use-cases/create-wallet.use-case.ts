import { Injectable } from '@nestjs/common';
import { WalletKind } from 'prisma/generated/prisma';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateWalletDto } from '../dto';
import { CreateWalletOutput } from '../types';

@Injectable()
export class CreateWalletUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(createWalletDto: CreateWalletDto, userId: string): Promise<CreateWalletOutput> {
        const {
            name,
            description,
            amount,
            balanceStatus,
            walletKind = WalletKind.simple,
            walletTypeId,
            currencyId,
            active = true,
            pinOnMain = false,
            pinned = false,
            visible = true,
            monthlyLimit,
            details,
        } = createWalletDto;

        const hasDetails = Boolean(
            details && Object.values(details).some((value) => value !== undefined && value !== null && value !== ''),
        );

        const wallet = await this.prisma.wallet.create({
            data: {
                userId,
                updatedById: userId,
                name,
                description,
                amount,
                balanceStatus: balanceStatus ?? 'unknown',
                walletKind,
                ...(walletTypeId && { walletTypeId }),
                currencyId,
                active,
                pinOnMain,
                pinned,
                visible,
                ...(monthlyLimit !== undefined && { monthlyLimit }),
                ...(hasDetails && {
                    details: {
                        create: {
                            userId,
                            updatedById: userId,
                            phone: details?.phone ?? null,
                            card: details?.card ?? null,
                            ownerFullName: details?.ownerFullName ?? null,
                            address: details?.address ?? null,
                            accountId: details?.accountId ?? null,
                            username: details?.username ?? null,
                            exchangeUid: details?.exchangeUid ?? null,
                            networkId: details?.networkId ?? null,
                            networkTypeId: details?.networkTypeId ?? null,
                            platformId: details?.platformId ?? null,
                            bankId: details?.bankId ?? null,
                        },
                    },
                }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
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
                walletType: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        description: true,
                        showInTabs: true,
                        tabOrder: true,
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
                        platform: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                        bank: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            message: 'Кошелек успешно создан',
            wallet,
        };
    }
}
