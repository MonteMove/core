import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateNetworkDto } from '../dto';
import { CreateNetworkResponse } from '../types';

@Injectable()
export class CreateNetworkUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(createNetworkDto: CreateNetworkDto, userId: string): Promise<CreateNetworkResponse> {
        const { code, name, active } = createNetworkDto;

        const existingNetworkByCode = await this.prisma.network.findFirst({
            where: {
                code,
                deleted: false,
            },
        });

        if (existingNetworkByCode) {
            throw new BadRequestException(`Сеть с кодом "${code}" уже существует`);
        }

        const deletedNetworkByCode = await this.prisma.network.findFirst({
            where: {
                code,
                deleted: true,
            },
        });

        if (deletedNetworkByCode) {
            throw new BadRequestException(
                `Сеть с кодом "${code}" была удалена. Восстановите её или используйте другой код`,
            );
        }

        const existingNetworkByName = await this.prisma.network.findFirst({
            where: {
                name,
                deleted: false,
            },
        });

        if (existingNetworkByName) {
            throw new BadRequestException(`Сеть с названием "${name}" уже существует`);
        }

        const network = await this.prisma.network.create({
            data: {
                userId,
                updatedById: userId,
                code,
                name,
                active: active ?? true,
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
            message: 'Сеть успешно создана',
            network,
        };
    }
}
