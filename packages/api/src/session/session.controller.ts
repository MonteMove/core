import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { RoleCode } from '../../prisma/generated/prisma';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiCrudResponses,
  ApiPaginationParams,
  ApiReadResponses,
  ApiTag,
} from '../common';
import { SortOrder } from '../common/enums';
import {
  DeactivateSessionsDto,
  DeactivateSessionsResponseDto,
  GetSessionsDto,
  GetSessionsResponseDto,
  SessionSortField,
} from './dto';
import { DeactivateMySessionsByIdDto } from './dto/requests/deactivate-my-session-by-id.dto';
import { DeactivateMySessionByIdResponseDto } from './dto/responses/deactivate-my-session-by-id-response.dto';
import {
  DeactivateMySessionByIdUseCase,
  DeactivateUserSessionsUseCase,
  GetSessionsUseCase,
} from './use-cases';

@ApiTag('Sessions', 'Управление сессиями пользователей')
@ApiBearerAuth('access-token')
@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionController {
  constructor(
    private readonly getSessionsUseCase: GetSessionsUseCase,
    private readonly deactivateUserSessionsUseCase: DeactivateUserSessionsUseCase,
    private readonly deactivateMySessionByIdUseCase: DeactivateMySessionByIdUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить список сессий',
    description:
      'Возвращает список всех сессий с поддержкой фильтрации и пагинации',
  })
  @ApiPaginationParams()
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Фильтр по ID пользователя',
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Поле сортировки',
    enum: SessionSortField,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Направление сортировки',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'revoked',
    required: false,
    description: 'Фильтр по статусу деактивации',
    schema: { type: 'boolean' },
  })
  @ApiQuery({
    name: 'ip',
    required: false,
    description: 'Фильтр по IP адресу',
    example: '192.168.0.1',
  })
  @ApiResponse({
    status: 200,
    description: 'Список сессий успешно получен',
    type: GetSessionsResponseDto,
  })
  @ApiReadResponses()
  public async getSessions(
    @Query() getSessionsDto: GetSessionsDto,
  ): Promise<GetSessionsResponseDto> {
    const result = await this.getSessionsUseCase.execute(getSessionsDto);

    return {
      sessions: result.sessions,
      pagination: result.pagination,
    };
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Получить мои сессии',
    description: 'Возвращает список сессий текущего пользователя',
  })
  @ApiPaginationParams()
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: 'Поле сортировки',
    enum: SessionSortField,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Направление сортировки',
    enum: SortOrder,
  })
  @ApiQuery({
    name: 'revoked',
    required: false,
    description: 'Фильтр по статусу деактивации',
    schema: { type: 'boolean' },
  })
  @ApiQuery({
    name: 'ip',
    required: false,
    description: 'Фильтр по IP адресу',
    example: '192.168.0.1',
  })
  @ApiResponse({
    status: 200,
    description: 'Мои сессии успешно получены',
    type: GetSessionsResponseDto,
  })
  @ApiReadResponses()
  public async getMySessions(
    @CurrentUserId() userId: string,
    @Query() getSessionsDto: GetSessionsDto,
  ): Promise<GetSessionsResponseDto> {
    const dto = { ...getSessionsDto, userId };

    const result = await this.getSessionsUseCase.execute(dto);

    return {
      sessions: result.sessions,
      pagination: result.pagination,
    };
  }

  @Post('deactivate/:userId')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Деактивировать сессии пользователя',
    description: 'Деактивирует все активные сессии указанного пользователя',
  })
  @ApiParam({ name: 'userId', description: 'ID пользователя', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Сессии пользователя деактивированы',
    type: DeactivateSessionsResponseDto,
  })
  @ApiCrudResponses()
  @ApiBody({ type: DeactivateSessionsDto, required: false })
  public async deactivateUserSessions(
    @Param('userId') userId: string,
    @Body() deactivateSessionsDto?: DeactivateSessionsDto,
  ): Promise<DeactivateSessionsResponseDto> {
    const { excludeSessionId } = deactivateSessionsDto ?? {};
    const result = await this.deactivateUserSessionsUseCase.execute(
      userId,
      excludeSessionId,
    );

    return {
      message: result.message,
      deactivatedCount: result.deactivatedCount,
    };
  }

  @Post('deactivate-my')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Деактивировать мои сессии',
    description: 'Деактивирует все сессии текущего пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Мои сессии деактивированы',
    type: DeactivateSessionsResponseDto,
  })
  @ApiCrudResponses()
  @ApiBody({ type: DeactivateSessionsDto, required: false })
  public async deactivateMySessions(
    @CurrentUserId() userId: string,
    @Body() deactivateSessionsDto?: DeactivateSessionsDto,
  ): Promise<DeactivateSessionsResponseDto> {
    const { excludeSessionId } = deactivateSessionsDto ?? {};
    const result = await this.deactivateUserSessionsUseCase.execute(
      userId,
      excludeSessionId,
    );

    return {
      message: result.message,
      deactivatedCount: result.deactivatedCount,
    };
  }

  @Post('deactivate-my/:sessionId')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleCode.admin, RoleCode.moderator)
  @ApiOperation({
    summary: 'Деактивировать мою сессию',
    description: 'Деактивирует конкретную сессию текущего пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Сессия деактивированна',
    type: DeactivateMySessionByIdResponseDto,
  })
  @ApiCrudResponses()
  public async deactivateMySession(
    @CurrentUserId() userId: string,
    @Param() params: DeactivateMySessionsByIdDto,
  ): Promise<DeactivateMySessionByIdResponseDto> {
    const result = await this.deactivateMySessionByIdUseCase.execute(
      userId,
      params.sessionId,
    );

    return {
      message: result.message,
    };
  }
}
