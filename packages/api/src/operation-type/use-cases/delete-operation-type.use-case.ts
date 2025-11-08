import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteOperationTypeResponse } from '../types';

const SYSTEM_OPERATION_TYPE_CODES = ['avans', 'correction'];

@Injectable()
export class DeleteOperationTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(operationTypeId: string, deletedById: string): Promise<DeleteOperationTypeResponse> {
        const existingOperationType = await this.prisma.operationType.findUnique({
            where: { id: operationTypeId },
            select: {
                id: true,
                code: true,
                deleted: true,
            },
        });

        if (!existingOperationType || existingOperationType.deleted) {
            throw new NotFoundException('Тип операции не найден');
        }

        if (SYSTEM_OPERATION_TYPE_CODES.includes(existingOperationType.code)) {
            throw new BadRequestException('Системный тип операции нельзя удалить');
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
