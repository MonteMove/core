import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { isString } from 'class-validator';
import { Request, Response } from 'express';

import { RoleCode } from '../../prisma/generated/prisma';
import {
  ApiAuthResponses,
  ApiRateLimitResponse,
  ApiTag,
  ApiUnauthorizedResponse,
  ApiValidationErrorResponse,
  ConflictErrorDto,
  UnauthorizedErrorDto,
} from '../common';
import { CookieConfigService } from '../common/services/cookie-config.service';
import { Roles } from './decorators/roles.decorator';
import {
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth';
import { RolesGuard } from './guards/roles.guard';
import {
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshTokensUseCase,
  RegisterUserUseCase,
} from './use-cases';

@ApiTag('Auth', 'Аутентификация и авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase,
    private readonly cookieConfigService: CookieConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Регистрация нового пользователя',
    description:
      'Создает нового пользователя в системе. Доступно только администраторам.',
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: RegisterResponseDto,
  })
  @ApiValidationErrorResponse()
  @ApiAuthResponses()
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким именем уже существует',
    type: ConflictErrorDto,
  })
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.registerUserUseCase.execute(registerDto);

    return {
      message: result.message,
      user: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Авторизация пользователя',
    description:
      'Выполняет вход пользователя в систему. Возвращает JWT токен доступа и устанавливает refresh токен в cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: LoginResponseDto,
  })
  @ApiValidationErrorResponse()
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные или пользователь заблокирован',
    type: UnauthorizedErrorDto,
  })
  @ApiRateLimitResponse(5, 60000)
  public async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const sessionInfo = {
      ip: request.ip || request.socket.remoteAddress,
      userAgent: request.get('User-Agent'),
    };

    const result = await this.loginUserUseCase.execute(loginDto, sessionInfo);

    response.cookie(
      this.cookieConfigService.refreshTokenCookieName,
      result.tokens.refreshToken,
      this.cookieConfigService.refreshTokenCookieOptions,
    );

    return {
      accessToken: result.tokens.accessToken,
      user: result.user,
      message: 'Успешный вход в систему',
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Обновление токенов',
    description:
      'Обновляет JWT токен доступа используя refresh токен из cookie. Требует валидный access токен в заголовке Authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: RefreshResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiRateLimitResponse(10, 60000)
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponseDto> {
    const authHeader = request.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '';

    const cookieName = this.cookieConfigService.refreshTokenCookieName;
    const refreshToken: unknown = request.cookies?.[cookieName];

    if (!isString(refreshToken)) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    const sessionInfo = {
      ip: request.ip || request.socket.remoteAddress,
      userAgent: request.get('User-Agent'),
    };

    const tokens = await this.refreshTokensUseCase.execute(
      accessToken,
      refreshToken,
      sessionInfo,
    );

    response.cookie(
      this.cookieConfigService.refreshTokenCookieName,
      tokens.refreshToken,
      this.cookieConfigService.refreshTokenCookieOptions,
    );

    return {
      accessToken: tokens.accessToken,
      message: 'Токены успешно обновлены',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Выход из системы',
    description:
      'Выполняет выход пользователя из системы. Отзывает текущую сессию и очищает refresh токен из cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Выход успешно выполнен',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse()
  @ApiRateLimitResponse(10, 60000)
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    const authHeader = request.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '';

    const result = await this.logoutUserUseCase.execute(accessToken);

    const cookieOptions = this.cookieConfigService.refreshTokenCookieOptions;

    response.clearCookie(this.cookieConfigService.refreshTokenCookieName, {
      domain: cookieOptions.domain,
      path: cookieOptions.path,
    });

    return result;
  }
}
