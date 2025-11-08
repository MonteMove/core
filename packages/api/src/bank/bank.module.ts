import { Module } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { BankController } from './bank.controller';
import {
    CreateBankUseCase,
    DeleteBankUseCase,
    GetBankByIdUseCase,
    GetBanksUseCase,
    RestoreBankUseCase,
    UpdateBankUseCase,
} from './use-cases';

@Module({
    controllers: [BankController],
    providers: [
        PrismaService,
        CreateBankUseCase,
        GetBanksUseCase,
        GetBankByIdUseCase,
        UpdateBankUseCase,
        DeleteBankUseCase,
        RestoreBankUseCase,
    ],
    exports: [],
})
export class BankModule {}
