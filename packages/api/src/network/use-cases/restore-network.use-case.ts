import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { RestoreNetworkOutput } from '../types';

@Injectable()
export class RestoreNetworkUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(networkId: string, restoredById: string): Promise<RestoreNetworkOutput> {
        const network = await this.prisma.network.findUnique({
            where: { id: networkId },
        });

        if (!network) {
            throw new NotFoundException('Сеть не найдена');
        }

        if (!network.deleted) {
            throw new NotFoundException('Сеть не удалена');
        }

        await this.prisma.network.update({
            where: { id: networkId },
            data: {
                deleted: false,
                updatedById: restoredById,
            },
        });

        return {
            message: 'Сеть успешно восстановлена',
        };
    }
}
