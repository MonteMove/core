import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { NetworkTypeController } from './network-type.controller';
import { NetworkTypeInitService } from './network-type-init.service';
import {
    CreateNetworkTypeUseCase,
    DeleteNetworkTypeUseCase,
    GetNetworkTypeByIdUseCase,
    GetNetworkTypesUseCase,
    RestoreNetworkTypeUseCase,
    UpdateNetworkTypeUseCase,
} from './use-cases';

@Module({
    controllers: [NetworkTypeController],
    providers: [
        NetworkTypeInitService,
        CreateNetworkTypeUseCase,
        GetNetworkTypeByIdUseCase,
        GetNetworkTypesUseCase,
        UpdateNetworkTypeUseCase,
        DeleteNetworkTypeUseCase,
        RestoreNetworkTypeUseCase,
        PrismaService,
        JwtAuthGuard,
        RolesGuard,
    ],
    exports: [
        CreateNetworkTypeUseCase,
        GetNetworkTypeByIdUseCase,
        GetNetworkTypesUseCase,
        UpdateNetworkTypeUseCase,
        DeleteNetworkTypeUseCase,
        PrismaService,
    ],
})
export class NetworkTypeModule {}
