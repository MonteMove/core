import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetNetworkByIdResponse } from '../types';

@Injectable()
export class GetNetworkByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(networkId: string): Promise<GetNetworkByIdResponse> {
        const network = await this.prisma.network.findUnique({
            where: { id: networkId },
            include: {
                created_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                updated_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        if (!network || network.deleted) {
            throw new NotFoundException('Сеть не найдена');
        }

        const { deleted: _, ...networkResponse } = network;

        return {
            network: networkResponse,
        };
    }
}
