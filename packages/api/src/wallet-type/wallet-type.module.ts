import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../common/services/prisma.service';
import {
    CreateWalletTypeUseCase,
    DeleteWalletTypeUseCase,
    GetWalletTypesUseCase,
    UpdateWalletTypeUseCase,
} from './use-cases';
import { WalletTypeController } from './wallet-type.controller';

@Module({
    imports: [AuthModule],
    controllers: [WalletTypeController],
    providers: [
        PrismaService,
        GetWalletTypesUseCase,
        CreateWalletTypeUseCase,
        UpdateWalletTypeUseCase,
        DeleteWalletTypeUseCase,
    ],
})
export class WalletTypeModule {}
