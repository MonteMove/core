import { Module } from '@nestjs/common';

import { PrismaService } from '../common/services/prisma.service';
import { PlatformController } from './platform.controller';
import {
    CreatePlatformUseCase,
    DeletePlatformUseCase,
    GetPlatformByIdUseCase,
    GetPlatformsUseCase,
    RestorePlatformUseCase,
    UpdatePlatformUseCase,
} from './use-cases';

@Module({
    controllers: [PlatformController],
    providers: [
        PrismaService,
        CreatePlatformUseCase,
        GetPlatformsUseCase,
        GetPlatformByIdUseCase,
        UpdatePlatformUseCase,
        DeletePlatformUseCase,
        RestorePlatformUseCase,
    ],
    exports: [],
})
export class PlatformModule {}
