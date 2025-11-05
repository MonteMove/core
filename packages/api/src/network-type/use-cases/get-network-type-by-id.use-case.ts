import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetNetworkTypeByIdResponse } from '../types';

@Injectable()
export class GetNetworkTypeByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(networkTypeId: string): Promise<GetNetworkTypeByIdResponse> {
        const networkType = await this.prisma.networkType.findUnique({
            where: { id: networkTypeId },
            include: {
                network: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
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

        if (!networkType || networkType.deleted) {
            throw new NotFoundException('Тип сети не найден');
        }

        return {
            networkType,
        };
    }
}
