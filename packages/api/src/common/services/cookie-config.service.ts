import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieConfigService {
    constructor(private readonly configService: ConfigService) {}

    public get refreshTokenCookieName(): string {
        return this.configService.getOrThrow<string>('REFRESH_TOKEN_COOKIE_NAME');
    }

    public get refreshTokenCookieOptions(): CookieOptions {
        const domain = this.configService.get<string>('REFRESH_TOKEN_COOKIE_DOMAIN');
        return {
            httpOnly: true,
            secure: this.configService.getOrThrow<string>('REFRESH_TOKEN_COOKIE_SECURE') === 'true',
            ...domain && { domain },
            path: this.configService.getOrThrow<string>('REFRESH_TOKEN_COOKIE_PATH'),
            sameSite: this.configService.getOrThrow<string>('REFRESH_TOKEN_COOKIE_SAME_SITE') as
                | 'strict'
                | 'lax'
                | 'none',
            maxAge: Number(this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')) * 1000,
        };
    }
}
