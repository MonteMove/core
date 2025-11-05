import { Injectable, Logger } from '@nestjs/common';

import { JwtTokenService } from '../jwt.service';
import { LogoutUserOutput } from '../types';

@Injectable()
export class LogoutUserUseCase {
    private readonly _logger = new Logger(LogoutUserUseCase.name);

    constructor(private readonly jwtTokenService: JwtTokenService) {}

    public async execute(accessToken: string): Promise<LogoutUserOutput> {
        try {
            if (!accessToken || accessToken.trim() === '') {
                this._logger.warn('Попытка выхода без access token');

                return {
                    message: 'Выход выполнен успешно',
                };
            }

            const userPayload = await this.jwtTokenService.validateAccessToken(accessToken);

            if (userPayload) {
                const decodedToken = this.jwtTokenService.getJtiFromToken(accessToken);

                if (decodedToken) {
                    await this.jwtTokenService.revokeSession(decodedToken);
                    this._logger.log(`Сессия отозвана для пользователя: ${userPayload.username}`);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                this._logger.error(`Ошибка при выходе: ${error.message}`);
            }
        }

        return {
            message: 'Выход выполнен успешно',
        };
    }
}
