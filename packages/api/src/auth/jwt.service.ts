import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { isJwtPayload, isRefreshTokenPayload } from '../auth/type-guards';
import { SessionInfo, TokenPair, UserPayload } from '../auth/types';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class JwtTokenService {
  private readonly maxSessions: number;

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.maxSessions = Number(
      this.configService.getOrThrow<string>('MAX_SESSIONS'),
    );
  }

  public async generateTokenPair(
    userPayload: UserPayload,
    sessionInfo: SessionInfo,
  ): Promise<TokenPair> {
    const jti = randomUUID();
    const refreshJti = randomUUID();

    const accessToken = this.jwtService.sign(
      { ...userPayload, jti },
      {
        expiresIn: parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        ),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id: userPayload.id,
        jti: refreshJti,
        sessionJti: jti,
        type: 'refresh',
      },
      {
        expiresIn: parseInt(
          this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        ),
      },
    );

    await this.createSession(userPayload.id, jti, refreshJti, sessionInfo);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createSession(
    userId: string,
    jti: string,
    refreshJti: string,
    sessionInfo: SessionInfo,
  ): Promise<void> {
    const activeSessions = await this.prisma.session.count({
      where: {
        userId,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (activeSessions >= this.maxSessions) {
      const oldestSessions = await this.prisma.session.findMany({
        where: {
          userId,
          revoked: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'asc' },
        take: activeSessions - this.maxSessions + 1,
      });

      await this.prisma.session.deleteMany({
        where: {
          id: { in: oldestSessions.map((s) => s.id) },
        },
      });
    }

    const refreshTokenExpiresInMs = Number(
      this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRES_IN_MS'),
    );

    if (isNaN(refreshTokenExpiresInMs) || refreshTokenExpiresInMs <= 0) {
      throw new Error(
        `Невалидное значение JWT_REFRESH_TOKEN_EXPIRES_IN_MS: ${refreshTokenExpiresInMs}`,
      );
    }

    const expirationTime = Date.now() + refreshTokenExpiresInMs;
    const expirationDate = new Date(expirationTime);

    await this.prisma.session.create({
      data: {
        userId,
        jti,
        refreshTokenHash: refreshJti,
        ip: sessionInfo.ip,
        userAgent: sessionInfo.userAgent,
        expiresAt: expirationDate,
      },
    });
  }

  public async validateRefreshToken(
    refreshToken: string,
    sessionJti: string,
  ): Promise<string | null> {
    try {
      const decodedPayload: unknown = this.jwtService.verify(refreshToken);

      if (!isRefreshTokenPayload(decodedPayload)) {
        return null;
      }

      if (decodedPayload.sessionJti !== sessionJti) {
        return null;
      }

      const session = await this.prisma.session.findUnique({
        where: { jti: sessionJti },
        include: { user: true },
      });

      if (!session || session.revoked || session.expiresAt < new Date()) {
        return null;
      }

      if (session.refreshTokenHash !== decodedPayload.jti) {
        return null;
      }

      return decodedPayload.id;
    } catch {
      return null;
    }
  }

  public async revokeSession(jti: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { jti },
      data: { revoked: true },
    });
  }

  public getJtiFromToken(accessToken: string): string | null {
    try {
      const decodedAccess: unknown = this.jwtService.decode(accessToken);

      if (!isJwtPayload(decodedAccess)) {
        return null;
      }

      return decodedAccess.jti;
    } catch {
      return null;
    }
  }

  public async validateAccessToken(
    accessToken: string,
  ): Promise<UserPayload | null> {
    try {
      const payload: unknown = this.jwtService.verify(accessToken);

      if (!isJwtPayload(payload)) {
        return null;
      }

      const session = await this.prisma.session.findUnique({
        where: { jti: payload.jti },
      });

      if (!session || session.revoked) {
        return null;
      }

      return {
        id: payload.id,
        username: payload.username,
        roles: payload.roles,
      };
    } catch {
      return null;
    }
  }

  public async refreshTokens(
    accessToken: string,
    refreshToken: string,
    sessionInfo: SessionInfo,
  ): Promise<TokenPair | null> {
    const decodedAccess: unknown = this.jwtService.decode(accessToken);

    if (!isJwtPayload(decodedAccess)) {
      return null;
    }

    const userId = await this.validateRefreshToken(
      refreshToken,
      decodedAccess.jti,
    );

    if (!userId) {
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          where: { deleted: false },
          select: { code: true },
        },
      },
    });

    if (!user || user.deleted || user.blocked) {
      return null;
    }

    await this.revokeSession(decodedAccess.jti);

    const userPayload: UserPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.code),
    };

    return this.generateTokenPair(userPayload, sessionInfo);
  }
}
