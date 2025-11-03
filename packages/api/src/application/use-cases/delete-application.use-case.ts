import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteApplicationOutput } from '../types';

@Injectable()
export class DeleteApplicationUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    applicationId: number,
    deletedById: string,
  ): Promise<DeleteApplicationOutput> {
    const existingApplication = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApplication || existingApplication.deleted) {
      throw new NotFoundException('Заявка не найдена');
    }

    await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        deleted: true,
        updatedById: deletedById,
      },
    });

    return {
      message: 'Заявка успешно удалена',
    };
  }
}
