import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { WalletRecalculationService, WalletSecurityService } from './services';
import {
    CreateWalletUseCase,
    DeleteWalletUseCase,
    GetPinnedWalletsUseCase,
    GetWalletByIdUseCase,
    GetWalletsUseCase,
    UpdateWalletUseCase,
} from './use-cases';
import { WalletController } from './wallet.controller';

@Module({
    controllers: [WalletController],
    providers: [
        PrismaService,
        WalletRecalculationService,
        WalletSecurityService,
        JwtAuthGuard,
        RolesGuard,
        CreateWalletUseCase,
        GetWalletsUseCase,
        GetPinnedWalletsUseCase,
        GetWalletByIdUseCase,
        UpdateWalletUseCase,
        DeleteWalletUseCase,
    ],
    exports: [
        CreateWalletUseCase,
        GetWalletsUseCase,
        GetPinnedWalletsUseCase,
        GetWalletByIdUseCase,
        UpdateWalletUseCase,
        DeleteWalletUseCase,
        WalletRecalculationService,
        WalletSecurityService,
    ],
})
export class WalletModule {}
