import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateOperationTypeDto } from '../dto';
import { UpdateOperationTypeResponse } from '../types';

@Injectable()
export class UpdateOperationTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        operationTypeId: string,
        updateOperationTypeDto: UpdateOperationTypeDto,
        updatedById: string,
    ): Promise<UpdateOperationTypeResponse> {
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

        const operationType = await this.prisma.operationType.update({
            where: { id: operationTypeId },
            data: {
                updatedById,
                ...(updateOperationTypeDto.name !== undefined && { name: updateOperationTypeDto.name }),
                ...(updateOperationTypeDto.description !== undefined && {
                    description: updateOperationTypeDto.description,
                }),
            },
            select: {
                id: true,
                userId: true,
                updatedById: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            message: 'Тип операции успешно обновлён',
            operationType,
        };
    }
}
