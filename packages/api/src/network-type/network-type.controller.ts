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
  CreateNetworkTypeDto,
  CreateNetworkTypeResponseDto,
  DeleteNetworkTypeResponseDto,
  GetNetworkTypesDto,
  GetNetworkTypesResponseDto,
  NetworkTypeResponseDto,
  RestoreNetworkTypeResponseDto,
  UpdateNetworkTypeDto,
  UpdateNetworkTypeResponseDto,
} from './dto';
import {
  CreateNetworkTypeUseCase,
  DeleteNetworkTypeUseCase,
  GetNetworkTypeByIdUseCase,
  GetNetworkTypesUseCase,
  RestoreNetworkTypeUseCase,
  UpdateNetworkTypeUseCase,
} from './use-cases';

@ApiTag('Network Types', 'Управление типами сетей')
@ApiBearerAuth('access-token')
@Controller('network-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NetworkTypeController {
  constructor(
    private readonly createNetworkTypeUseCase: CreateNetworkTypeUseCase,
    private readonly getNetworkTypeByIdUseCase: GetNetworkTypeByIdUseCase,
    private readonly getNetworkTypesUseCase: GetNetworkTypesUseCase,
    private readonly updateNetworkTypeUseCase: UpdateNetworkTypeUseCase,
    private readonly deleteNetworkTypeUseCase: DeleteNetworkTypeUseCase,
    private readonly restoreNetworkTypeUseCase: RestoreNetworkTypeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Создать новый тип сети',
    description:
      'Создаёт тип сети для выбранной блокчейн-сети. Доступно администраторам и модераторам.',
  })
  @ApiBody({ type: CreateNetworkTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Тип сети успешно создан',
    type: CreateNetworkTypeResponseDto,
  })
  @ApiCrudResponses()
  public async createNetworkType(
    @Body() createNetworkTypeDto: CreateNetworkTypeDto,
    @CurrentUserId() userId: string,
  ): Promise<CreateNetworkTypeResponseDto> {
    const result = await this.createNetworkTypeUseCase.execute(
      createNetworkTypeDto,
      userId,
    );

    return {
      message: result.message,
      networkType: result.networkType,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить список типов сетей',
    description:
      'Возвращает список типов сетей с поддержкой фильтров, поиска и пагинации.',
  })
  @ApiListParams('Фильтры, поиск и пагинация для списка типов сетей')
  @ApiResponse({
    status: 200,
    description: 'Список типов сетей успешно получен',
    type: GetNetworkTypesResponseDto,
  })
  @ApiReadResponses()
  public async getNetworkTypes(
    @Query() getNetworkTypesDto: GetNetworkTypesDto,
  ): Promise<GetNetworkTypesResponseDto> {
    const result =
      await this.getNetworkTypesUseCase.execute(getNetworkTypesDto);

    return {
      networkTypes: result.networkTypes,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить тип сети по ID',
    description: 'Возвращает подробную информацию о конкретном типе сети.',
  })
  @ApiIdParam('Уникальный идентификатор типа сети')
  @ApiResponse({
    status: 200,
    description: 'Тип сети найден',
    type: NetworkTypeResponseDto,
  })
  @ApiReadResponses()
  public async getNetworkTypeById(
    @Param('id') networkTypeId: string,
  ): Promise<NetworkTypeResponseDto> {
    const result = await this.getNetworkTypeByIdUseCase.execute(networkTypeId);

    return result.networkType;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Обновить тип сети',
    description:
      'Обновляет данные существующего типа сети. Доступно администраторам и модераторам.',
  })
  @ApiIdParam('Уникальный идентификатор типа сети')
  @ApiBody({ type: UpdateNetworkTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Тип сети успешно обновлён',
    type: UpdateNetworkTypeResponseDto,
  })
  @ApiCrudResponses()
  public async updateNetworkType(
    @Param('id') networkTypeId: string,
    @Body() updateNetworkTypeDto: UpdateNetworkTypeDto,
    @CurrentUserId() userId: string,
  ): Promise<UpdateNetworkTypeResponseDto> {
    const result = await this.updateNetworkTypeUseCase.execute(
      networkTypeId,
      updateNetworkTypeDto,
      userId,
    );

    return {
      message: result.message,
      networkType: result.networkType,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin)
  @ApiOperation({
    summary: 'Удалить тип сети',
    description:
      'Выполняет мягкое удаление типа сети. Доступно только администраторам.',
  })
  @ApiIdParam('Уникальный идентификатор типа сети')
  @ApiResponse({
    status: 200,
    description: 'Тип сети успешно удалён',
    type: DeleteNetworkTypeResponseDto,
  })
  @ApiReadResponses()
  public async deleteNetworkType(
    @Param('id') networkTypeId: string,
    @CurrentUserId() userId: string,
  ): Promise<DeleteNetworkTypeResponseDto> {
    const result = await this.deleteNetworkTypeUseCase.execute(
      networkTypeId,
      userId,
    );

    return {
      message: result.message,
    };
  }

  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin)
  @ApiOperation({
    summary: 'Восстановить тип сети',
    description:
      'Восстанавливает удалённый тип сети. Доступно только администраторам.',
  })
  @ApiIdParam('Уникальный идентификатор типа сети')
  @ApiResponse({
    status: 200,
    description: 'Тип сети успешно восстановлен',
    type: RestoreNetworkTypeResponseDto,
  })
  @ApiReadResponses()
  public async restoreNetworkType(
    @Param('id') networkTypeId: string,
    @CurrentUserId() userId: string,
  ): Promise<RestoreNetworkTypeResponseDto> {
    const result = await this.restoreNetworkTypeUseCase.execute(
      networkTypeId,
      userId,
    );

    return {
      message: result.message,
    };
  }
}
