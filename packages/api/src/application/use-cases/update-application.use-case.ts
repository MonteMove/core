import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common';
import { UpdateApplicationDto } from '../dto';
import { UpdateApplicationOutput } from '../types';

@Injectable()
export class UpdateApplicationUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    applicationId: number,
    updateApplicationDto: UpdateApplicationDto,
    updatedById: string,
  ): Promise<UpdateApplicationOutput> {
    const {
      description,
      status,
      amount,
      currencyId,
      operationTypeId,
      assigneeUserId,
      operationId,
      telegramUsername,
      phone,
      meetingDate,
    } = updateApplicationDto;

    const existingApplication = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApplication || existingApplication.deleted) {
      throw new NotFoundException('Заявка не найдена');
    }

    const application = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        updatedById,
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(amount !== undefined && { amount }),
        ...(currencyId !== undefined && { currencyId }),
        ...(operationTypeId !== undefined && { operationTypeId }),
        ...(assigneeUserId !== undefined && { assigneeUserId }),
        ...(operationId !== undefined && { operationId }),
        ...(telegramUsername !== undefined && { telegramUsername }),
        ...(phone !== undefined && { phone }),
        ...(meetingDate !== undefined && {
          meetingDate: new Date(meetingDate),
        }),
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

    const { deleted: _, ...applicationResponse } = application;

    return {
      message: 'Заявка успешно обновлена',
      application: applicationResponse,
    };
  }
}
