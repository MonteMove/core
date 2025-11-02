import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateNetworkTypeDto } from '../dto';
import { CreateNetworkTypeResponse } from '../types';

@Injectable()
export class CreateNetworkTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        createNetworkTypeDto: CreateNetworkTypeDto,
        userId: string,
    ): Promise<CreateNetworkTypeResponse> {
        const { networkId, code, name } = createNetworkTypeDto;

        const network = await this.prisma.network.findFirst({
            where: {
                id: networkId,
                deleted: false,
            },
            select: {
                id: true,
            },
        });

        if (!network) {
            throw new NotFoundException(`Сеть с ID ${networkId} не найдена`);
        }

        const existingNetworkType = await this.prisma.networkType.findFirst({
            where: {
                networkId,
                code,
                deleted: false,
            },
        });

        if (existingNetworkType) {
            throw new BadRequestException(`Тип сети с кодом "${code}" уже существует для данной сети`);
        }

        const networkType = await this.prisma.networkType.create({
            data: {
                userId,
                updatedById: userId,
                networkId,
                code,
                name,
            },
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

        const { deleted: _, ...networkTypeResponse } = networkType;

        return {
            message: 'Тип сети успешно создан',
            networkType: networkTypeResponse,
        };
    }
}
