import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { JwtTokenService } from '../jwt.service';

@Injectable()
export class SessionActivityMiddleware implements NestMiddleware {
    private readonly logger = new Logger(SessionActivityMiddleware.name);

    constructor(private readonly jwtTokenService: JwtTokenService) {}

    public use(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const jti = this.jwtTokenService.getJtiFromToken(token);

            if (jti) {
                this.jwtTokenService.updateSessionActivity(jti).catch((error) => {
                    this.logger.error('Failed to update session activity', error);
                });
            }
        }

        next();
    }
}
