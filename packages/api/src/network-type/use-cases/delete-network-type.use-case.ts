import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteNetworkTypeResponse } from '../types';

@Injectable()
export class DeleteNetworkTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(networkTypeId: string, deletedById: string): Promise<DeleteNetworkTypeResponse> {
        const existingNetworkType = await this.prisma.networkType.findUnique({
            where: { id: networkTypeId },
        });

        if (!existingNetworkType || existingNetworkType.deleted) {
            throw new NotFoundException('Тип сети не найден');
        }

        await this.prisma.networkType.update({
            where: { id: networkTypeId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Тип сети успешно удалён',
        };
    }
}
