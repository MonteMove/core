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
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { RoleCode } from '../../prisma/generated/prisma';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiCrudResponses, ApiIdParam, ApiTag } from '../common';
import { BankResponseDto, CreateBankDto, GetBanksDto, GetBanksResponseDto, UpdateBankDto } from './dto';
import {
    CreateBankUseCase,
    DeleteBankUseCase,
    GetBankByIdUseCase,
    GetBanksUseCase,
    RestoreBankUseCase,
    UpdateBankUseCase,
} from './use-cases';

@ApiTag('Banks', 'Управление банками')
@ApiBearerAuth('access-token')
@Controller('banks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BankController {
    constructor(
        private readonly createBankUseCase: CreateBankUseCase,
        private readonly getBanksUseCase: GetBanksUseCase,
        private readonly getBankByIdUseCase: GetBankByIdUseCase,
        private readonly updateBankUseCase: UpdateBankUseCase,
        private readonly deleteBankUseCase: DeleteBankUseCase,
        private readonly restoreBankUseCase: RestoreBankUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiOperation({
        summary: 'Создать новый банк',
        description: 'Создаёт новый банк. Доступно администраторам и модераторам.',
    })
    @ApiBody({ type: CreateBankDto })
    @ApiResponse({
        status: 201,
        description: 'Банк успешно создан',
        type: BankResponseDto,
    })
    @ApiCrudResponses()
    public async createBank(
        @Body() createBankDto: CreateBankDto,
        @CurrentUserId() userId: string,
    ): Promise<BankResponseDto> {
        return await this.createBankUseCase.execute(createBankDto, userId);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Получить список банков',
        description: 'Возвращает список банков с возможностью фильтрации.',
    })
    @ApiResponse({
        status: 200,
        description: 'Список банков успешно получен',
        type: GetBanksResponseDto,
    })
    @ApiCrudResponses()
    public async getBanks(@Query() getBanksDto: GetBanksDto): Promise<GetBanksResponseDto> {
        return await this.getBanksUseCase.execute(getBanksDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Получить банк по ID',
        description: 'Возвращает банк по его идентификатору.',
    })
    @ApiResponse({
        status: 200,
        description: 'Банк успешно получен',
        type: BankResponseDto,
    })
    @ApiCrudResponses()
    public async getBankById(@Param('id') id: string): Promise<BankResponseDto> {
        return await this.getBankByIdUseCase.execute(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin, RoleCode.moderator)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Обновить банк',
        description: 'Обновляет информацию о банке. Доступно администраторам и модераторам.',
    })
    @ApiBody({ type: UpdateBankDto })
    @ApiResponse({
        status: 200,
        description: 'Банк успешно обновлён',
        type: BankResponseDto,
    })
    @ApiCrudResponses()
    public async updateBank(
        @Param('id') id: string,
        @Body() updateBankDto: UpdateBankDto,
        @CurrentUserId() userId: string,
    ): Promise<BankResponseDto> {
        return await this.updateBankUseCase.execute(id, updateBankDto, userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Удалить банк',
        description: 'Помечает банк как удалённый. Доступно только администраторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Банк успешно удалён',
        type: BankResponseDto,
    })
    @ApiCrudResponses()
    public async deleteBank(@Param('id') id: string, @CurrentUserId() userId: string): Promise<BankResponseDto> {
        return await this.deleteBankUseCase.execute(id, userId);
    }

    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiIdParam()
    @ApiOperation({
        summary: 'Восстановить удалённый банк',
        description: 'Восстанавливает удалённый банк. Доступно только администраторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Банк успешно восстановлен',
        type: BankResponseDto,
    })
    @ApiCrudResponses()
    public async restoreBank(@Param('id') id: string, @CurrentUserId() userId: string): Promise<BankResponseDto> {
        return await this.restoreBankUseCase.execute(id, userId);
    }
}
