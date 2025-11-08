import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { OperationTypeController } from './operation-type.controller';
import { OperationTypeInitService } from './operation-type-init.service';
import {
    CreateOperationTypeUseCase,
    DeleteOperationTypeUseCase,
    GetOperationTypeByIdUseCase,
    GetOperationTypesUseCase,
    RestoreOperationTypeUseCase,
    UpdateOperationTypeUseCase,
} from './use-cases';

@Module({
    controllers: [OperationTypeController],
    providers: [
        CreateOperationTypeUseCase,
        GetOperationTypeByIdUseCase,
        GetOperationTypesUseCase,
        UpdateOperationTypeUseCase,
        DeleteOperationTypeUseCase,
        RestoreOperationTypeUseCase,
        PrismaService,
        JwtAuthGuard,
        RolesGuard,
        OperationTypeInitService,
    ],
    exports: [
        CreateOperationTypeUseCase,
        GetOperationTypeByIdUseCase,
        GetOperationTypesUseCase,
        UpdateOperationTypeUseCase,
        DeleteOperationTypeUseCase,
        RestoreOperationTypeUseCase,
        PrismaService,
    ],
})
export class OperationTypeModule {}
