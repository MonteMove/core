import { Prisma, WalletType } from '../../../prisma/generated/prisma';

export interface ReportFile {
    buffer: Buffer;
    filename: string;
}

export interface WalletLookupEntry {
    id: string;
    name: string;
    walletType?: WalletType;
    currencyCode: string;
}

export type OperationsReportOperation = Prisma.OperationGetPayload<{
    include: {
        entries: {
            where: { deleted: false };
            select: {
                id: true;
                walletId: true;
                direction: true;
                amount: true;
            };
        };
        type: {
            select: {
                id: true;
                name: true;
            };
        };
        created_by: {
            select: {
                id: true;
                username: true;
            };
        };
        application: {
            where: { deleted: false };
            select: {
                id: true;
            };
        };
    };
}>;

export type ConversionReportOperation = Prisma.OperationGetPayload<{
    include: {
        entries: {
            where: { deleted: false };
            select: {
                id: true;
                walletId: true;
                direction: true;
                amount: true;
            };
        };
        type: {
            select: {
                id: true;
                name: true;
            };
        };
        created_by: {
            select: {
                id: true;
                username: true;
            };
        };
    };
}>;

export interface GeneralReportRow {
    number: number;
    date: string;
    operationType: string;
    author: string;
    comment: string;
    source: string;
    amount: string;
    currency: string;
    applicationNumber: string;
}

export interface ConversionReportRow {
    number: number;
    date: string;
    operationType: string;
    author: string;
    comment: string;
    source: string;
    amount: string;
    exchangeRate: number;
    currency: string;
}

export interface OperationWithDetails {
    id: string;
    description: string | null;
    createdAt: Date;
    conversionGroupId: number | null;
    type: {
        id: string;
        name: string;
    };
    created_by: {
        id: string;
        username: string;
    };
    entries: {
        id: string;
        walletId: string;
        direction: 'credit' | 'debit';
        amount: number;
    }[];
    applications: {
        id: number;
    }[];
}
