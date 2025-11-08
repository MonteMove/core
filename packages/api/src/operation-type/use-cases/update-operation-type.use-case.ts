import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateOperationTypeDto } from '../dto';
import { UpdateOperationTypeResponse } from '../types';

// Системные типы операций, у которых нельзя изменить код
const SYSTEM_OPERATION_TYPE_CODES = ['avans', 'correction'];

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
                code: true,
                deleted: true,
            },
        });

        if (!existingOperationType || existingOperationType.deleted) {
            throw new NotFoundException('Тип операции не найден');
        }

        // Проверка: нельзя изменить код системного типа операции
        if (
            updateOperationTypeDto.code !== undefined &&
            SYSTEM_OPERATION_TYPE_CODES.includes(existingOperationType.code) &&
            updateOperationTypeDto.code !== existingOperationType.code
        ) {
            throw new BadRequestException('Нельзя изменить код системного типа операции');
        }

        const operationType = await this.prisma.operationType.update({
            where: { id: operationTypeId },
            data: {
                updatedById,
                ...(updateOperationTypeDto.code !== undefined && {
                    code: updateOperationTypeDto.code,
                }),
                ...(updateOperationTypeDto.name !== undefined && {
                    name: updateOperationTypeDto.name,
                }),
                ...(updateOperationTypeDto.description !== undefined && {
                    description: updateOperationTypeDto.description,
                }),
                ...(updateOperationTypeDto.isSeparateTab !== undefined && {
                    isSeparateTab: updateOperationTypeDto.isSeparateTab,
                }),
                ...(updateOperationTypeDto.active !== undefined && {
                    active: updateOperationTypeDto.active,
                }),
            },
            select: {
                id: true,
                userId: true,
                updatedById: true,
                code: true,
                name: true,
                description: true,
                isSeparateTab: true,
                active: true,
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
