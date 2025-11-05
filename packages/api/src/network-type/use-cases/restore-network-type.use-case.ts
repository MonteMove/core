import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { RestoreNetworkTypeOutput } from '../types';

@Injectable()
export class RestoreNetworkTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(networkTypeId: string, restoredById: string): Promise<RestoreNetworkTypeOutput> {
        const networkType = await this.prisma.networkType.findUnique({
            where: { id: networkTypeId },
        });

        if (!networkType) {
            throw new NotFoundException('Тип сети не найден');
        }

        if (!networkType.deleted) {
            throw new NotFoundException('Тип сети не удалён');
        }

        await this.prisma.networkType.update({
            where: { id: networkTypeId },
            data: {
                deleted: false,
                updatedById: restoredById,
            },
        });

        return {
            message: 'Тип сети успешно восстановлен',
        };
    }
}
