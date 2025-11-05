import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { NetworkController } from './network.controller';
import {
    CreateNetworkUseCase,
    DeleteNetworkUseCase,
    GetNetworkByIdUseCase,
    GetNetworksUseCase,
    RestoreNetworkUseCase,
    UpdateNetworkUseCase,
} from './use-cases';

@Module({
    controllers: [NetworkController],
    providers: [
        CreateNetworkUseCase,
        GetNetworkByIdUseCase,
        GetNetworksUseCase,
        UpdateNetworkUseCase,
        DeleteNetworkUseCase,
        RestoreNetworkUseCase,
        PrismaService,
        JwtAuthGuard,
        RolesGuard,
    ],
    exports: [
        CreateNetworkUseCase,
        GetNetworkByIdUseCase,
        GetNetworksUseCase,
        UpdateNetworkUseCase,
        DeleteNetworkUseCase,
        PrismaService,
    ],
})
export class NetworkModule {}
