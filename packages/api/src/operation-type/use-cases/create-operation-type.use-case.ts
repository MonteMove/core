import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateOperationTypeDto } from '../dto';
import { CreateOperationTypeResponse } from '../types';

@Injectable()
export class CreateOperationTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        createOperationTypeDto: CreateOperationTypeDto,
        userId: string,
    ): Promise<CreateOperationTypeResponse> {
        const { name, description, isSeparateTab } = createOperationTypeDto;

        const operationType = await this.prisma.operationType.create({
            data: {
                userId,
                updatedById: userId,
                name,
                description,
                isSeparateTab,
            },
            select: {
                id: true,
                userId: true,
                updatedById: true,
                name: true,
                description: true,
                isSeparateTab: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            message: 'Тип операции успешно создан',
            operationType,
        };
    }
}
