import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { RoleCode } from '../../prisma/generated/prisma';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiCrudResponses,
  ApiIdParam,
  ApiListParams,
  ApiReadResponses,
  ApiTag,
} from '../common';
import {
  CreateNetworkDto,
  CreateNetworkResponseDto,
  DeleteNetworkResponseDto,
  GetNetworksDto,
  GetNetworksResponseDto,
  NetworkResponseDto,
  RestoreNetworkResponseDto,
  UpdateNetworkDto,
  UpdateNetworkResponseDto,
} from './dto';
import {
  CreateNetworkUseCase,
  DeleteNetworkUseCase,
  GetNetworkByIdUseCase,
  GetNetworksUseCase,
  RestoreNetworkUseCase,
  UpdateNetworkUseCase,
} from './use-cases';

@ApiTag('Networks', 'Управление сетями блокчейна')
@ApiBearerAuth('access-token')
@Controller('networks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NetworkController {
  constructor(
    private readonly createNetworkUseCase: CreateNetworkUseCase,
    private readonly getNetworkByIdUseCase: GetNetworkByIdUseCase,
    private readonly getNetworksUseCase: GetNetworksUseCase,
    private readonly updateNetworkUseCase: UpdateNetworkUseCase,
    private readonly deleteNetworkUseCase: DeleteNetworkUseCase,
    private readonly restoreNetworkUseCase: RestoreNetworkUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Создать новую сеть',
    description:
      'Создаёт новую блокчейн-сеть. Доступно администраторам и модераторам.',
  })
  @ApiBody({ type: CreateNetworkDto })
  @ApiResponse({
    status: 201,
    description: 'Сеть успешно создана',
    type: CreateNetworkResponseDto,
  })
  @ApiCrudResponses()
  public async createNetwork(
    @Body() createNetworkDto: CreateNetworkDto,
    @CurrentUserId() userId: string,
  ): Promise<CreateNetworkResponseDto> {
    const result = await this.createNetworkUseCase.execute(
      createNetworkDto,
      userId,
    );

    return {
      message: result.message,
      network: result.network,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить список сетей',
    description:
      'Возвращает список сетей с поддержкой фильтрации, поиска и пагинации.',
  })
  @ApiListParams('Фильтры, поиск и пагинация для списка сетей')
  @ApiResponse({
    status: 200,
    description: 'Список сетей успешно получен',
    type: GetNetworksResponseDto,
  })
  @ApiReadResponses()
  public async getNetworks(
    @Query() getNetworksDto: GetNetworksDto,
  ): Promise<GetNetworksResponseDto> {
    const result = await this.getNetworksUseCase.execute(getNetworksDto);

    return {
      networks: result.networks,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить сеть по ID',
    description: 'Возвращает информацию о конкретной блокчейн-сети.',
  })
  @ApiIdParam('Уникальный идентификатор сети')
  @ApiResponse({
    status: 200,
    description: 'Сеть найдена',
    type: NetworkResponseDto,
  })
  @ApiReadResponses()
  public async getNetworkById(
    @Param('id') networkId: string,
  ): Promise<NetworkResponseDto> {
    const result = await this.getNetworkByIdUseCase.execute(networkId);

    return result.network;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Обновить сеть',
    description:
      'Обновляет данные существующей блокчейн-сети. Доступно администраторам и модераторам.',
  })
  @ApiIdParam('Уникальный идентификатор сети')
  @ApiBody({ type: UpdateNetworkDto })
  @ApiResponse({
    status: 200,
    description: 'Сеть успешно обновлена',
    type: UpdateNetworkResponseDto,
  })
  @ApiCrudResponses()
  public async updateNetwork(
    @Param('id') networkId: string,
    @Body() updateNetworkDto: UpdateNetworkDto,
    @CurrentUserId() userId: string,
  ): Promise<UpdateNetworkResponseDto> {
    const result = await this.updateNetworkUseCase.execute(
      networkId,
      updateNetworkDto,
      userId,
    );

    return {
      message: result.message,
      network: result.network,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin)
  @ApiOperation({
    summary: 'Удалить сеть',
    description:
      'Выполняет мягкое удаление сети. Доступно только администраторам.',
  })
  @ApiIdParam('Уникальный идентификатор сети')
  @ApiResponse({
    status: 200,
    description: 'Сеть успешно удалена',
    type: DeleteNetworkResponseDto,
  })
  @ApiReadResponses()
  public async deleteNetwork(
    @Param('id') networkId: string,
    @CurrentUserId() userId: string,
  ): Promise<DeleteNetworkResponseDto> {
    const result = await this.deleteNetworkUseCase.execute(networkId, userId);

    return {
      message: result.message,
    };
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin)
  @ApiOperation({
    summary: 'Восстановить сеть',
    description:
      'Восстанавливает удалённую сеть. Доступно только администраторам.',
  })
  @ApiIdParam('Уникальный идентификатор сети')
  @ApiResponse({
    status: 200,
    description: 'Сеть успешно восстановлена',
    type: RestoreNetworkResponseDto,
  })
  @ApiReadResponses()
  public async restoreNetwork(
    @Param('id') networkId: string,
    @CurrentUserId() userId: string,
  ): Promise<RestoreNetworkResponseDto> {
    const result = await this.restoreNetworkUseCase.execute(networkId, userId);

    return {
      message: result.message,
    };
  }
}
