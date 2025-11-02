import { WalletResponseDto } from '../dto';

export interface CreateWalletOutput {
    message: string;
    wallet: WalletResponseDto;
}

export interface GetWalletByIdOutput {
    wallet: WalletResponseDto;
}

export interface GetWalletsOutput {
    wallets: WalletResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateWalletOutput {
    message: string;
    wallet: WalletResponseDto;
}

export interface DeleteWalletOutput {
    message: string;
}

export interface GetPinnedWalletsOutput {
    currencyGroups: {
        currency: string;
        wallets: WalletResponseDto[];
    }[];
    totalWallets: number;
    totalCurrencies: number;
}

export interface WalletAnalyticsItem {
    walletId: string;
    walletName: string;
    walletCurrency: string;
    holder: string | null;
    currentBalance: number;
    coming: number;
    expenditure: number;
    netFlow: number;
    operationsCount: number;
}

export interface GetWalletAnalyticsOutput {
    message: string;
    analytics: WalletAnalyticsItem[];
    summary: {
        totalWallets: number;
        totalBalance: number;
        totalComing: number;
        totalExpenditure: number;
        totalNetFlow: number;
        totalOperations: number;
        currencyBreakdown: Record<string, number>;
    };
}

export interface OperationEntryWithDetails {
    id: string;
    amount: number;
    direction: string;
    createdAt: Date;
    description: string | null;
    operationType: {
        name: string;
    } | null;
}

export interface DailyOperationResponse {
    id: string;
    amount: number;
    direction: string;
    time: string;
    description: string | null;
    operationType: string | null;
}

export interface DailyOperationsGroup {
    date: string;
    operations: DailyOperationResponse[];
    dailyBalance: number;
    dailyChange: number;
}

export interface GetWalletDailyOperationsOutput {
    wallet: {
        id: string;
        name: string | null;
        amount: number;
        currency: {
            id: string;
            code: string;
            name: string;
        };
    };
    dailyOperations: DailyOperationsGroup[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    summary: {
        totalOperations: number;
        totalDays: number;
        dateRange: {
            startDate: string;
            endDate: string;
        };
        finalBalance: number;
        totalChange: number;
    };
}
