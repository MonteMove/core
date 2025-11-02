import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../common/services/prisma.service';
import { UserPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    public async validate(payload: UserPayload): Promise<UserPayload> {
        const user = await this._prisma.user.findUnique({
            where: { id: payload.id },
            include: { roles: true },
        });

        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        if (user.blocked) {
            throw new UnauthorizedException('Аккаунт заблокирован');
        }

        if (user.deleted) {
            throw new UnauthorizedException('Аккаунт удален');
        }

        return {
            id: user.id,
            username: user.username,
            roles: user.roles.map((role) => role.code),
        };
    }
}
