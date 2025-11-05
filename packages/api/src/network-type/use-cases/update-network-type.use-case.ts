import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateNetworkTypeDto } from '../dto';
import { UpdateNetworkTypeResponse } from '../types';

@Injectable()
export class UpdateNetworkTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        networkTypeId: string,
        updateNetworkTypeDto: UpdateNetworkTypeDto,
        updatedById: string,
    ): Promise<UpdateNetworkTypeResponse> {
        const { networkId, code, name } = updateNetworkTypeDto;

        const existingNetworkType = await this.prisma.networkType.findUnique({
            where: { id: networkTypeId },
        });

        if (!existingNetworkType || existingNetworkType.deleted) {
            throw new NotFoundException('Тип сети не найден');
        }

        if (networkId) {
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
        }

        if (code && code !== existingNetworkType.code) {
            const duplicateCode = await this.prisma.networkType.findFirst({
                where: {
                    code,
                    networkId: networkId ?? existingNetworkType.networkId,
                    deleted: false,
                    id: {
                        not: networkTypeId,
                    },
                },
            });

            if (duplicateCode) {
                throw new BadRequestException(`Тип сети с кодом "${code}" уже существует для данной сети`);
            }
        }

        const networkType = await this.prisma.networkType.update({
            where: { id: networkTypeId },
            data: {
                updatedById,
                ...(networkId && { networkId }),
                ...(code && { code }),
                ...(name && { name }),
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

        return {
            message: 'Тип сети успешно обновлён',
            networkType,
        };
    }
}
