import { Prisma } from '../../../prisma/generated/prisma';
import { WalletResponseDto } from '../dto';

export type WalletWithRelations = Prisma.WalletGetPayload<{
    include: {
        created_by: {
            select: {
                id: true;
                username: true;
            };
        };
        updated_by: {
            select: {
                id: true;
                username: true;
            };
        };
        currency: {
            select: {
                id: true;
                name: true;
                code: true;
            };
        };
        details: {
            select: {
                id: true;
                phone: true;
                card: true;
                ownerFullName: true;
                address: true;
                accountId: true;
                username: true;
                exchangeUid: true;
                network: {
                    select: {
                        id: true;
                        code: true;
                        name: true;
                    };
                };
                networkType: {
                    select: {
                        id: true;
                        code: true;
                        name: true;
                    };
                };
            };
        };
    };
}>;

const mapWalletDetailsToResponse = (details: WalletWithRelations['details']): WalletResponseDto['details'] => {
    if (!details) {
        return null;
    }

    return {
        id: details.id,
        phone: details.phone,
        card: details.card,
        ownerFullName: details.ownerFullName,
        address: details.address,
        accountId: details.accountId,
        username: details.username,
        exchangeUid: details.exchangeUid,
        network: details.network
            ? {
                  id: details.network.id,
                  code: details.network.code,
                  name: details.network.name,
              }
            : null,
        networkType: details.networkType
            ? {
                  id: details.networkType.id,
                  code: details.networkType.code,
                  name: details.networkType.name,
              }
            : null,
    };
};

export const mapWalletToResponse = (wallet: WalletWithRelations): WalletResponseDto => ({
    id: wallet.id,
    user: {
        id: wallet.created_by.id,
        username: wallet.created_by.username,
    },
    updatedById: wallet.updatedById,
    currencyId: wallet.currencyId,
    name: wallet.name,
    description: wallet.description,
    amount: wallet.amount,
    balanceStatus: wallet.balanceStatus,
    walletKind: wallet.walletKind,
    walletType: wallet.walletType,
    active: wallet.active,
    pinOnMain: wallet.pinOnMain,
    pinned: wallet.pinned,
    visible: wallet.visible,
    deleted: wallet.deleted,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
    created_by: wallet.created_by,
    updated_by: wallet.updated_by,
    currency: wallet.currency,
    details: mapWalletDetailsToResponse(wallet.details),
});
