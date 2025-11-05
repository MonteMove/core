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
import { ApiCrudResponses, ApiIdParam, ApiListParams, ApiReadResponses, ApiTag } from '../common';
import {
    ChangeWalletOwnerDto,
    ChangeWalletOwnerResponseDto,
    CreateWalletDto,
    CreateWalletResponseDto,
    DeleteWalletResponseDto,
    GetPinnedWalletsResponseDto,
    GetWalletsDto,
    GetWalletsResponseDto,
    ToggleWalletPinDto,
    UpdateWalletDto,
    UpdateWalletResponseDto,
    WalletResponseDto,
} from './dto';
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

@ApiTag('Wallets', 'Управление кошельками')
@ApiBearerAuth('access-token')
@Controller('wallets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalletController {
    constructor(
        private readonly createWalletUseCase: CreateWalletUseCase,
        private readonly getWalletsUseCase: GetWalletsUseCase,
        private readonly getPinnedWalletsUseCase: GetPinnedWalletsUseCase,
        private readonly getWalletByIdUseCase: GetWalletByIdUseCase,
        private readonly updateWalletUseCase: UpdateWalletUseCase,
        private readonly toggleWalletPinUseCase: ToggleWalletPinUseCase,
        private readonly changeWalletOwnerUseCase: ChangeWalletOwnerUseCase,
        private readonly deleteWalletUseCase: DeleteWalletUseCase,
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Получить список кошельков',
        description:
            'Возвращает список кошельков с поддержкой точного поиска по полям и пагинации. Доступно только администраторам.',
    })
    @ApiListParams('Точный поиск по полям кошелька')
    @ApiResponse({
        status: 200,
        description: 'Список кошельков успешно получен',
        type: GetWalletsResponseDto,
    })
    @ApiReadResponses()
    public async getWallets(@Query() getWalletsDto: GetWalletsDto): Promise<GetWalletsResponseDto> {
        const result = await this.getWalletsUseCase.execute(getWalletsDto);

        return {
            wallets: result.wallets,
            pagination: result.pagination,
        };
    }

    @Get('pinned')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Получить закрепленные кошельки',
        description:
            'Возвращает кошельки, закрепленные на главной странице, сгруппированные по валютам. Доступно только администраторам.',
    })
    @ApiResponse({
        status: 200,
        description: 'Закрепленные кошельки успешно получены',
        type: GetPinnedWalletsResponseDto,
    })
    @ApiReadResponses()
    public async getPinnedWallets(): Promise<GetPinnedWalletsResponseDto> {
        const result = await this.getPinnedWalletsUseCase.execute();

        return {
            currencyGroups: result.currencyGroups,
            totalWallets: result.totalWallets,
            totalCurrencies: result.totalCurrencies,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Получить кошелек по ID',
        description: 'Возвращает информацию о конкретном кошельке. Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiResponse({
        status: 200,
        description: 'Кошелек найден',
        type: WalletResponseDto,
    })
    @ApiReadResponses()
    public async getWalletById(@Param('id') walletId: string): Promise<WalletResponseDto> {
        const result = await this.getWalletByIdUseCase.execute(walletId);

        return result.wallet;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Создать новый кошелек',
        description: 'Создаёт новый кошелек в системе. Доступно только администраторам.',
    })
    @ApiBody({ type: CreateWalletDto })
    @ApiResponse({
        status: 201,
        description: 'Кошелек успешно создан',
        type: CreateWalletResponseDto,
    })
    @ApiCrudResponses()
    public async createWallet(
        @Body() createWalletDto: CreateWalletDto,
        @CurrentUserId() userId: string,
    ): Promise<CreateWalletResponseDto> {
        const result = await this.createWalletUseCase.execute(createWalletDto, userId);

        return {
            message: result.message,
            wallet: result.wallet,
        };
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Обновить кошелек',
        description: 'Обновляет данные существующего кошелька. Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiBody({ type: UpdateWalletDto })
    @ApiResponse({
        status: 200,
        description: 'Кошелек успешно обновлен',
        type: UpdateWalletResponseDto,
    })
    @ApiCrudResponses()
    public async updateWallet(
        @Param('id') walletId: string,
        @Body() updateWalletDto: UpdateWalletDto,
        @CurrentUserId() userId: string,
    ): Promise<UpdateWalletResponseDto> {
        const result = await this.updateWalletUseCase.execute(walletId, updateWalletDto, userId);

        return {
            message: result.message,
            wallet: result.wallet,
        };
    }

    @Put(':id/pin')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Изменить закрепление кошелька',
        description: 'Изменяет параметры закрепления кошелька (pinned, pinOnMain). Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiBody({ type: ToggleWalletPinDto })
    @ApiResponse({
        status: 200,
        description: 'Настройки закрепления успешно изменены',
        type: UpdateWalletResponseDto,
    })
    @ApiCrudResponses()
    public async toggleWalletPin(
        @Param('id') walletId: string,
        @Body() toggleWalletPinDto: ToggleWalletPinDto,
        @CurrentUserId() userId: string,
    ): Promise<UpdateWalletResponseDto> {
        const result = await this.toggleWalletPinUseCase.execute(walletId, toggleWalletPinDto, userId);

        return {
            message: result.message,
            wallet: result.wallet,
        };
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Частично обновить кошелек',
        description:
            'Позволяет обновить отдельные поля кошелька (например, balanceStatus). Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiResponse({
        status: 200,
        description: 'Кошелек успешно обновлен',
        type: UpdateWalletResponseDto,
    })
    @ApiCrudResponses()
    public async patchWallet(
        @Param('id') walletId: string,
        @Body() body: { balanceStatus?: string },
        @CurrentUserId() userId: string,
    ): Promise<UpdateWalletResponseDto> {
        const result = await this.updateWalletUseCase.execute(walletId, body as any, userId);

        return {
            message: result.message,
            wallet: result.wallet,
        };
    }

    @Put(':id/owner')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Изменить держателя кошелька',
        description:
            'Изменяет держателя кошелька. Новый держатель должен иметь статус isHolder. Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiBody({ type: ChangeWalletOwnerDto })
    @ApiResponse({
        status: 200,
        description: 'Держатель кошелька успешно изменен',
        type: ChangeWalletOwnerResponseDto,
    })
    @ApiCrudResponses()
    public async changeWalletOwner(
        @Param('id') walletId: string,
        @Body() changeWalletOwnerDto: ChangeWalletOwnerDto,
        @CurrentUserId() userId: string,
    ): Promise<ChangeWalletOwnerResponseDto> {
        const result = await this.changeWalletOwnerUseCase.execute(walletId, changeWalletOwnerDto, userId);

        return {
            message: result.message,
            wallet: result.wallet,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @Roles(RoleCode.admin)
    @ApiOperation({
        summary: 'Удалить кошелек',
        description: 'Выполняет мягкое удаление кошелька из системы. Доступно только администраторам.',
    })
    @ApiIdParam('Уникальный идентификатор кошелька')
    @ApiResponse({
        status: 200,
        description: 'Кошелек успешно удален',
        type: DeleteWalletResponseDto,
    })
    @ApiReadResponses()
    public async deleteWallet(
        @Param('id') walletId: string,
        @CurrentUserId() userId: string,
    ): Promise<DeleteWalletResponseDto> {
        const result = await this.deleteWalletUseCase.execute(walletId, userId);

        return {
            message: result.message,
        };
    }
}
