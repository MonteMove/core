import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { CurrencyController } from './currency.controller';
import {
    CreateCurrencyUseCase,
    DeleteCurrencyUseCase,
    GetCurrenciesUseCase,
    GetCurrencyByIdUseCase,
    UpdateCurrencyUseCase,
} from './use-cases';

@Module({
    controllers: [CurrencyController],
    providers: [
        CreateCurrencyUseCase,
        GetCurrencyByIdUseCase,
        GetCurrenciesUseCase,
        UpdateCurrencyUseCase,
        DeleteCurrencyUseCase,
        PrismaService,
        JwtAuthGuard,
        RolesGuard,
    ],
    exports: [PrismaService],
})
export class CurrencyModule {}
