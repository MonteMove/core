import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class RestoreOperationTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(operationTypeId: string, restoredById: string): Promise<{ message: string }> {
        const existingOperationType = await this.prisma.operationType.findUnique({
            where: { id: operationTypeId },
            select: {
                id: true,
                deleted: true,
            },
        });

        if (!existingOperationType) {
            throw new NotFoundException('Тип операции не найден');
        }

        if (!existingOperationType.deleted) {
            throw new NotFoundException('Тип операции не находится в удалённых');
        }

        await this.prisma.operationType.update({
            where: { id: operationTypeId },
            data: {
                deleted: false,
                updatedById: restoredById,
            },
        });

        return {
            message: 'Тип операции успешно восстановлен',
        };
    }
}
