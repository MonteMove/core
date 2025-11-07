import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetPlatformsResponseDto } from '../dto';

@Injectable()
export class GetPlatformsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(): Promise<GetPlatformsResponseDto> {
        const platforms = await this.prisma.platform.findMany({
            where: {
                deleted: false,
                active: true,
            },
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                code: true,
                description: true,
                icon: true,
                url: true,
                active: true,
                deleted: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            platforms,
        };
    }
}
