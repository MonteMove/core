import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common';
import { WalletRecalculationService } from '../../wallet/services';
import { CreateOperationDto } from '../dto';
import { CreateOperationResponse } from '../types';

@Injectable()
export class CreateOperationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecalculationService: WalletRecalculationService,
  ) {}

  public async execute(
    createOperationDto: CreateOperationDto,
    userId: string,
  ): Promise<CreateOperationResponse> {
    const {
      typeId,
      description,
      conversionGroupId,
      entries,
      applicationId,
      creatureDate,
    } = createOperationDto;

    return this.prisma.$transaction(async (tx) => {
      const operation = await tx.operation.create({
        data: {
          userId,
          updatedById: userId,
          typeId,
          applicationId,
          description,
          conversionGroupId,
          createdAt: creatureDate,
        },
      });

      for (const entry of entries) {
        await tx.operationEntry.create({
          data: {
            userId,
            updatedById: userId,
            operationId: operation.id,
            walletId: entry.walletId,
            direction: entry.direction,
            amount: entry.amount,
          },
        });
      }

      await this.walletRecalculationService.recalculateForOperation(
        tx,
        operation.id,
        userId,
      );

      const createdOperation = await tx.operation.findUnique({
        where: { id: operation.id },
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

      const { deleted: _, ...operationResponse } = createdOperation!;

      return {
        message: 'Операция успешно создана',
        operation: operationResponse,
      };
    });
  }
}
