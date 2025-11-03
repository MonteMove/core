import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateGuideDto } from '../dto';
import { UpdateGuideOutput } from '../types';

@Injectable()
export class UpdateGuideUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    guideId: string,
    updateGuideDto: UpdateGuideDto,
    updatedById: string,
  ): Promise<UpdateGuideOutput> {
    const { description, fullName, phone, cardNumber, birthDate, address } =
      updateGuideDto;

    const existingGuide = await this.prisma.guide.findUnique({
      where: { id: guideId },
    });

    if (!existingGuide || existingGuide.deleted) {
      throw new NotFoundException('Гайд не найден');
    }

    const guide = await this.prisma.guide.update({
      where: { id: guideId },
      data: {
        updatedById,
        ...(description !== undefined && { description }),
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(cardNumber !== undefined && { cardNumber }),
        ...(birthDate !== undefined && { birthDate }),
        ...(address !== undefined && { address }),
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

    const { deleted: _, ...guideResponse } = guide;

    return {
      message: 'Гайд успешно обновлен',
      guide: guideResponse,
    };
  }
}
