import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreatePlatformDto, PlatformResponseDto } from '../dto';

@Injectable()
export class CreatePlatformUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        createPlatformDto: CreatePlatformDto,
        userId: string,
    ): Promise<PlatformResponseDto> {
        const { code, name, description, icon, url, active } = createPlatformDto;

        const existingPlatformByCode = await this.prisma.platform.findFirst({
            where: {
                code,
                deleted: false,
            },
        });

        if (existingPlatformByCode) {
            throw new BadRequestException(
                `Платформа с кодом "${code}" уже существует`,
            );
        }

        const platform = await this.prisma.platform.create({
            data: {
                userId,
                updatedById: userId,
                code,
                name,
                description,
                icon,
                url,
                active: active ?? true,
            },
        });

        return {
            id: platform.id,
            name: platform.name,
            code: platform.code,
            description: platform.description,
            icon: platform.icon,
            url: platform.url,
            active: platform.active,
            deleted: platform.deleted,
            createdAt: platform.createdAt,
            updatedAt: platform.updatedAt,
        };
    }
}
