import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteGuideOutput } from '../types';

@Injectable()
export class DeleteGuideUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(guideId: string, deletedById: string): Promise<DeleteGuideOutput> {
        const existingGuide = await this.prisma.guide.findUnique({
            where: { id: guideId },
        });

        if (!existingGuide || existingGuide.deleted) {
            throw new NotFoundException('Гайд не найден');
        }

        await this.prisma.guide.update({
            where: { id: guideId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Гайд успешно удален',
        };
    }
}
