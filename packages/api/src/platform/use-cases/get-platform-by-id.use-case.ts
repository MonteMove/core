import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { PlatformResponseDto } from '../dto';

@Injectable()
export class GetPlatformByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(id: string): Promise<PlatformResponseDto> {
        const platform = await this.prisma.platform.findUnique({
            where: { id },
        });

        if (!platform) {
            throw new NotFoundException('Платформа не найдена');
        }

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
