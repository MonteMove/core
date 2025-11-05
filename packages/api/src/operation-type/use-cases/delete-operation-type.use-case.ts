import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteOperationTypeResponse } from '../types';

@Injectable()
export class DeleteOperationTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(operationTypeId: string, deletedById: string): Promise<DeleteOperationTypeResponse> {
        const existingOperationType = await this.prisma.operationType.findUnique({
            where: { id: operationTypeId },
            select: {
                id: true,
                deleted: true,
            },
        });

        if (!existingOperationType || existingOperationType.deleted) {
            throw new NotFoundException('Тип операции не найден');
        }

        await this.prisma.operationType.update({
            where: { id: operationTypeId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Тип операции успешно удалён',
        };
    }
}
