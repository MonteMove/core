import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../common/services/prisma.service';
import { GuideController } from './guide.controller';
import {
  CreateGuideUseCase,
  DeleteGuideUseCase,
  GetGuideByIdUseCase,
  GetGuidesUseCase,
  UpdateGuideUseCase,
} from './use-cases';

@Module({
  controllers: [GuideController],
  providers: [
    CreateGuideUseCase,
    GetGuideByIdUseCase,
    GetGuidesUseCase,
    UpdateGuideUseCase,
    DeleteGuideUseCase,
    PrismaService,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [PrismaService],
})
export class GuideModule {}
