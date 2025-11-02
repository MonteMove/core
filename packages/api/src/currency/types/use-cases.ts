import { CurrencyResponseDto } from '../dto';

export interface CreateCurrencyOutput {
    message: string;
    currency: CurrencyResponseDto;
}

export interface GetCurrencyByIdOutput {
    currency: CurrencyResponseDto;
}

export interface GetCurrenciesOutput {
    currencies: CurrencyResponseDto[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateCurrencyOutput {
    message: string;
    currency: CurrencyResponseDto;
}

export interface DeleteCurrencyOutput {
    message: string;
}
