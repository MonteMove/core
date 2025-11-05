import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleCode } from '../../prisma/generated/prisma';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiReadResponses } from '../common/decorators';
import {
    CreateWalletTypeDto,
    CreateWalletTypeResponseDto,
    DeleteWalletTypeResponseDto,
    GetWalletTypesResponseDto,
    UpdateWalletTypeDto,
    UpdateWalletTypeResponseDto,
} from './dto';
import {
    CreateWalletTypeUseCase,
    DeleteWalletTypeUseCase,
    GetWalletTypesUseCase,
    UpdateWalletTypeUseCase,
} from './use-cases';

@ApiTags('Типы кошельков')
@Controller('wallet-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletTypeController {
    constructor(
        private readonly getWalletTypesUseCase: GetWalletTypesUseCase,
        private readonly createWalletTypeUseCase: CreateWalletTypeUseCase,
        private readonly updateWalletTypeUseCase: UpdateWalletTypeUseCase,
        private readonly deleteWalletTypeUseCase: DeleteWalletTypeUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Получить список типов кошельков',
        description: 'Возвращает все активные типы кошельков',
    })
    @ApiResponse({
        status: 200,
        description: 'Список типов успешно получен',
        type: GetWalletTypesResponseDto,
    })
    @ApiReadResponses()
    public async getWalletTypes(): Promise<GetWalletTypesResponseDto> {
        return this.getWalletTypesUseCase.execute();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Создать тип кошелька',
        description: 'Создаёт новый тип кошелька. Доступно только администраторам.',
    })
    @ApiResponse({
        status: 201,
        description: 'Тип кошелька успешно создан',
        type: CreateWalletTypeResponseDto,
    })
    public async createWalletType(@Body() dto: CreateWalletTypeDto): Promise<CreateWalletTypeResponseDto> {
        return this.createWalletTypeUseCase.execute(dto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Обновить тип кошелька',
        description: 'Обновляет существующий тип кошелька. Доступно только администраторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Тип кошелька успешно обновлён',
        type: UpdateWalletTypeResponseDto,
    })
    public async updateWalletType(
        @Param('id') id: string,
        @Body() dto: UpdateWalletTypeDto,
    ): Promise<UpdateWalletTypeResponseDto> {
        return this.updateWalletTypeUseCase.execute(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Удалить тип кошелька',
        description: 'Удаляет тип кошелька (мягкое удаление). Доступно только администраторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Тип кошелька успешно удалён',
        type: DeleteWalletTypeResponseDto,
    })
    public async deleteWalletType(@Param('id') id: string): Promise<DeleteWalletTypeResponseDto> {
        return this.deleteWalletTypeUseCase.execute(id);
    }
}
