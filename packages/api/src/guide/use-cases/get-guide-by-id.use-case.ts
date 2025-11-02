import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetGuideByIdOutput } from '../types';

@Injectable()
export class GetGuideByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(guideId: string): Promise<GetGuideByIdOutput> {
        const guide = await this.prisma.guide.findUnique({
            where: { id: guideId },
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

        if (!guide || guide.deleted) {
            throw new NotFoundException('Гайд не найден');
        }

        const { deleted: _, ...guideResponse } = guide;

        return {
            guide: guideResponse,
        };
    }
}
