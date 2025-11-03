import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetApplicationByIdOutput } from '../types';

@Injectable()
export class GetApplicationByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    applicationId: number,
  ): Promise<GetApplicationByIdOutput> {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
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
        assignee_user: {
          select: {
            id: true,
            username: true,
          },
        },
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        operation_type: {
          select: {
            id: true,
            name: true,
          },
        },
        operation: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });

    if (!application || application.deleted) {
      throw new NotFoundException('Заявка не найдена');
    }

    const { deleted: _, ...applicationResponse } = application;

    return {
      application: applicationResponse,
    };
  }
}
