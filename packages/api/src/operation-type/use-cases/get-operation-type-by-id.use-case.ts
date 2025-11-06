import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetOperationTypeByIdResponse } from '../types';

@Injectable()
export class GetOperationTypeByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(operationTypeId: string): Promise<GetOperationTypeByIdResponse> {
        const operationType = await this.prisma.operationType.findUnique({
            where: { id: operationTypeId },
            select: {
                id: true,
                userId: true,
                updatedById: true,
                name: true,
                description: true,
                isSeparateTab: true,
                createdAt: true,
                updatedAt: true,
                deleted: true,
            },
        });

        if (!operationType || operationType.deleted) {
            throw new NotFoundException('Тип операции не найден');
        }

        const { deleted: _, ...operationTypeResponse } = operationType;

        return {
            operationType: operationTypeResponse,
        };
    }
}
