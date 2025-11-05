import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { WalletRecalculationService, WalletSecurityService } from './services';
import {
    ChangeWalletOwnerUseCase,
    CreateWalletUseCase,
    DeleteWalletUseCase,
    GetPinnedWalletsUseCase,
    GetWalletByIdUseCase,
    GetWalletsUseCase,
    ToggleWalletPinUseCase,
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
        ChangeWalletOwnerUseCase,
        CreateWalletUseCase,
        GetWalletsUseCase,
        GetPinnedWalletsUseCase,
        GetWalletByIdUseCase,
        ToggleWalletPinUseCase,
        UpdateWalletUseCase,
        DeleteWalletUseCase,
    ],
    exports: [
        ChangeWalletOwnerUseCase,
        CreateWalletUseCase,
        GetWalletsUseCase,
        GetPinnedWalletsUseCase,
        GetWalletByIdUseCase,
        ToggleWalletPinUseCase,
        UpdateWalletUseCase,
        DeleteWalletUseCase,
        WalletRecalculationService,
        WalletSecurityService,
    ],
})
export class WalletModule {}
