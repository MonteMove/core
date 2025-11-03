import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { OperationResponse } from '../types';

@Injectable()
export class GetOperationByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(operationId: string): Promise<OperationResponse> {
    const operation = await this.prisma.operation.findUnique({
      where: { id: operationId },
      include: {
        entries: {
          where: { deleted: false },
          select: {
            id: true,
            walletId: true,
            direction: true,
            amount: true,
            userId: true,
            updatedById: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
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

    if (!operation || operation.deleted) {
      throw new NotFoundException('Операция не найдена');
    }

    const { deleted: _, ...operationResponse } = operation;

    return operationResponse;
  }
}
