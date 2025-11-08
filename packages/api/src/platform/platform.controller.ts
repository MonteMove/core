import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RoleCode } from '../../prisma/generated/prisma';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCrudResponses, ApiIdParam, ApiTag } from '../common';
import { CreatePlatformDto, GetPlatformsResponseDto, PlatformResponseDto, UpdatePlatformDto } from './dto';
import {
    CreatePlatformUseCase,
    DeletePlatformUseCase,
    GetPlatformByIdUseCase,
    GetPlatformsUseCase,
    RestorePlatformUseCase,
    UpdatePlatformUseCase,
} from './use-cases';

@ApiTag('Platforms', 'Управление платформами')
@ApiBearerAuth('access-token')
@Controller('platforms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlatformController {
    constructor(
        private readonly createPlatformUseCase: CreatePlatformUseCase,
        private readonly getPlatformsUseCase: GetPlatformsUseCase,
        private readonly getPlatformByIdUseCase: GetPlatformByIdUseCase,
        private readonly updatePlatformUseCase: UpdatePlatformUseCase,
        private readonly deletePlatformUseCase: DeletePlatformUseCase,
        private readonly restorePlatformUseCase: RestorePlatformUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiOperation({
        summary: 'Создать новую платформу',
        description: 'Создаёт новую платформу. Доступно администраторам и модераторам.',
    })
    @ApiBody({ type: CreatePlatformDto })
    @ApiResponse({
        status: 201,
        description: 'Платформа успешно создана',
        type: PlatformResponseDto,
    })
    @ApiCrudResponses()
    public async createPlatform(
        @Body() createPlatformDto: CreatePlatformDto,
        @CurrentUserId() userId: string,
    ): Promise<PlatformResponseDto> {
        return await this.createPlatformUseCase.execute(createPlatformDto, userId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Получить список платформ',
        description: 'Возвращает список всех активных платформ.',
    })
    @ApiResponse({
        status: 200,
        description: 'Список платформ успешно получен',
        type: GetPlatformsResponseDto,
    })
    @ApiCrudResponses()
    public async getPlatforms(): Promise<GetPlatformsResponseDto> {
        return await this.getPlatformsUseCase.execute();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Получить платформу по ID',
        description: 'Возвращает платформу по её идентификатору.',
    })
    @ApiResponse({
        status: 200,
        description: 'Платформа успешно получена',
        type: PlatformResponseDto,
    })
    @ApiCrudResponses()
    public async getPlatformById(@Param('id') id: string): Promise<PlatformResponseDto> {
        return await this.getPlatformByIdUseCase.execute(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Обновить платформу',
        description: 'Обновляет данные платформы. Доступно администраторам и модераторам.',
    })
    @ApiBody({ type: UpdatePlatformDto })
    @ApiResponse({
        status: 200,
        description: 'Платформа успешно обновлена',
        type: PlatformResponseDto,
    })
    @ApiCrudResponses()
    public async updatePlatform(
        @Param('id') id: string,
        @Body() updatePlatformDto: UpdatePlatformDto,
        @CurrentUserId() userId: string,
    ): Promise<PlatformResponseDto> {
        return await this.updatePlatformUseCase.execute(id, updatePlatformDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Удалить платформу',
        description: 'Помечает платформу как удалённую. Доступно администраторам и модераторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Платформа успешно удалена',
    })
    @ApiCrudResponses()
    public async deletePlatform(
        @Param('id') id: string,
        @CurrentUserId() userId: string,
    ): Promise<{ message: string }> {
        return await this.deletePlatformUseCase.execute(id, userId);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Восстановить платформу',
        description: 'Восстанавливает удалённую платформу. Доступно администраторам и модераторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Платформа успешно восстановлена',
    })
    @ApiCrudResponses()
    public async restorePlatform(
        @Param('id') id: string,
        @CurrentUserId() userId: string,
    ): Promise<{ message: string }> {
        return await this.restorePlatformUseCase.execute(id, userId);
    }
}
