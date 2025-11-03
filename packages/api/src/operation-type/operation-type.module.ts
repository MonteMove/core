import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { OperationTypeController } from './operation-type.controller';
import {
  CreateOperationTypeUseCase,
  DeleteOperationTypeUseCase,
  GetOperationTypeByIdUseCase,
  GetOperationTypesUseCase,
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
    PrismaService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [
    CreateOperationTypeUseCase,
    GetOperationTypeByIdUseCase,
    GetOperationTypesUseCase,
    UpdateOperationTypeUseCase,
    DeleteOperationTypeUseCase,
    PrismaService,
  ],
})
export class OperationTypeModule {}
