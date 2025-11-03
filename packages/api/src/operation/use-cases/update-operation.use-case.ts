import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { WalletRecalculationService } from '../../wallet/services/wallet-recalculation.service';
import { UpdateOperationDto } from '../dto';
import { UpdateOperationResponse } from '../types';

@Injectable()
export class UpdateOperationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecalculationService: WalletRecalculationService,
  ) {}

  public async execute(
    operationId: string,
    updateOperationDto: UpdateOperationDto,
    updatedById: string,
  ): Promise<UpdateOperationResponse> {
    const existingOperation = await this.prisma.operation.findUnique({
      where: { id: operationId },
      include: {
        entries: {
          where: { deleted: false },
          select: {
            id: true,
            walletId: true,
            direction: true,
            amount: true,
          },
        },
      },
    });

    if (!existingOperation || existingOperation.deleted) {
      throw new NotFoundException('Операция не найдена');
    }

    return await this.prisma.$transaction(async (tx) => {
      const { typeId, description, conversionGroupId, entries } =
        updateOperationDto;

      await tx.operation.update({
        where: { id: operationId },
        data: {
          updatedById,
          ...(typeId !== undefined && { typeId }),
          ...(description !== undefined && { description }),
          ...(conversionGroupId !== undefined && { conversionGroupId }),
        },
      });

      if (entries) {
        const existingEntries = existingOperation.entries;

        for (const entry of entries) {
          if (entry.id) {
            const existingEntry = existingEntries.find(
              (item) => item.id === entry.id,
            );

            if (!existingEntry) {
              throw new NotFoundException(
                `Запись операции с ID ${entry.id} не найдена`,
              );
            }

            await tx.operationEntry.update({
              where: { id: entry.id },
              data: {
                updatedById,
                walletId: entry.walletId,
                direction: entry.direction,
                amount: entry.amount,
              },
            });
          } else {
            await tx.operationEntry.create({
              data: {
                userId: updatedById,
                updatedById,
                operationId,
                walletId: entry.walletId,
                direction: entry.direction,
                amount: entry.amount,
              },
            });
          }
        }

        await this.walletRecalculationService.recalculateForOperation(
          tx,
          operationId,
          updatedById,
        );
      }

      const updatedOperation = await tx.operation.findUnique({
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

      const { deleted: _, ...operationResponse } = updatedOperation!;

      return {
        message: 'Операция успешно обновлена',
        operation: operationResponse,
      };
    });
  }
}
