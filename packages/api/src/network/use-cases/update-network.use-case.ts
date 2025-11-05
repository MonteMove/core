import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateNetworkDto } from '../dto';
import { UpdateNetworkResponse } from '../types';

@Injectable()
export class UpdateNetworkUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        networkId: string,
        updateNetworkDto: UpdateNetworkDto,
        updatedById: string,
    ): Promise<UpdateNetworkResponse> {
        const { code, name } = updateNetworkDto;

        const existingNetwork = await this.prisma.network.findUnique({
            where: { id: networkId },
        });

        if (!existingNetwork || existingNetwork.deleted) {
            throw new NotFoundException('Сеть не найдена');
        }

        if (code !== undefined && code !== existingNetwork.code) {
            const networkWithCode = await this.prisma.network.findFirst({
                where: {
                    code,
                    deleted: false,
                    id: {
                        not: networkId,
                    },
                },
            });

            if (networkWithCode) {
                throw new BadRequestException(`Сеть с кодом "${code}" уже существует`);
            }
        }

        if (name !== undefined && name !== existingNetwork.name) {
            const networkWithName = await this.prisma.network.findFirst({
                where: {
                    name,
                    deleted: false,
                    id: {
                        not: networkId,
                    },
                },
            });

            if (networkWithName) {
                throw new BadRequestException(`Сеть с названием "${name}" уже существует`);
            }
        }

        const network = await this.prisma.network.update({
            where: { id: networkId },
            data: {
                updatedById,
                ...(code !== undefined && { code }),
                ...(name !== undefined && { name }),
            },
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

        return {
            message: 'Сеть успешно обновлена',
            network,
        };
    }
}
