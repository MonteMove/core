import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeactivateMySessionByIdOutput } from '../types';

@Injectable()
export class DeactivateMySessionByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(userId: string, sessionId?: string): Promise<DeactivateMySessionByIdOutput> {
        await this.prisma.session.updateMany({
            where: { userId, id: sessionId },
            data: {
                revoked: true,
            },
        });

        return {
            message: 'Сессии пользователя успешно деактивированы',
        };
    }
}
