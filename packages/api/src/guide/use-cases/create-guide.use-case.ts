import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateGuideDto } from '../dto';
import { CreateGuideOutput } from '../types';

@Injectable()
export class CreateGuideUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    createGuideDto: CreateGuideDto,
    userId: string,
  ): Promise<CreateGuideOutput> {
    const { description, fullName, phone, cardNumber, birthDate, address } =
      createGuideDto;

    const guide = await this.prisma.guide.create({
      data: {
        userId,
        updatedById: userId,
        description,
        fullName,
        phone,
        cardNumber,
        birthDate,
        address,
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
      message: 'Гайд успешно создан',
      guide: guideResponse,
    };
  }
}
