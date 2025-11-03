import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtTokenService } from '../jwt.service';
import { SessionInfo, TokenPair } from '../types';

@Injectable()
export class RefreshTokensUseCase {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  public async execute(
    accessToken: string,
    refreshToken: string,
    sessionInfo: SessionInfo,
  ): Promise<TokenPair> {
    if (!accessToken || accessToken.trim() === '') {
      throw new UnauthorizedException(
        'Access token не найден в заголовке Authorization',
      );
    }

    if (!refreshToken || refreshToken.trim() === '') {
      throw new UnauthorizedException('Refresh token не найден');
    }

    const tokens = await this.jwtTokenService.refreshTokens(
      accessToken,
      refreshToken,
      sessionInfo,
    );

    if (!tokens) {
      throw new UnauthorizedException('Недействительные токены');
    }

    return tokens;
  }
}
