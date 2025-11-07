import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetOperationTypesDto } from '../dto';
import { GetOperationTypesResponse } from '../types';

@Injectable()
export class GetOperationTypesUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getOperationTypesDto: GetOperationTypesDto): Promise<GetOperationTypesResponse> {
        const {
            search,
            name,
            userId,
            updatedById,
            sortField = 'createdAt',
            sortOrder = 'desc',
            page,
            limit,
        } = getOperationTypesDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.OperationTypeWhereInput = {
            deleted: false,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }

        if (userId) {
            where.userId = userId;
        }

        if (updatedById) {
            where.updatedById = updatedById;
        }

        const total = await this.prisma.operationType.count({ where });

        const baseOptions = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
            select: {
                id: true,
                userId: true,
                updatedById: true,
                name: true,
                description: true,
                isSeparateTab: true,
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        } satisfies Prisma.OperationTypeFindManyArgs;

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const operationTypes = await this.prisma.operationType.findMany(findManyOptions);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            operationTypes,
            pagination: paginationResponse,
        };
    }
}
