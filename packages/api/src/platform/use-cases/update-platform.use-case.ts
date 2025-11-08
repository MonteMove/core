import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { PlatformResponseDto, UpdatePlatformDto } from '../dto';

@Injectable()
export class UpdatePlatformUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        id: string,
        updatePlatformDto: UpdatePlatformDto,
        userId: string,
    ): Promise<PlatformResponseDto> {
        const existingPlatform = await this.prisma.platform.findUnique({
            where: { id },
        });

        if (!existingPlatform || existingPlatform.deleted) {
            throw new NotFoundException('Платформа не найдена');
        }

        if (updatePlatformDto.code && updatePlatformDto.code !== existingPlatform.code) {
            const platformWithCode = await this.prisma.platform.findFirst({
                where: {
                    code: updatePlatformDto.code,
                    deleted: false,
                    id: { not: id },
                },
            });

            if (platformWithCode) {
                throw new BadRequestException(`Платформа с кодом "${updatePlatformDto.code}" уже существует`);
            }
        }

        const platform = await this.prisma.platform.update({
            where: { id },
            data: {
                ...updatePlatformDto,
                updatedById: userId,
            },
        });

        return {
            id: platform.id,
            name: platform.name,
            code: platform.code,
            active: platform.active,
            deleted: platform.deleted,
            createdAt: platform.createdAt,
            updatedAt: platform.updatedAt,
        };
    }
}
