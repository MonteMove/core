import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetOperationsDto } from '../dto';
import { GetOperationsResponse } from '../types';

@Injectable()
export class GetOperationsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getOperationsDto: GetOperationsDto): Promise<GetOperationsResponse> {
        const {
            search,
            typeId,
            userId,
            updatedById,
            conversionGroupId,
            walletId,
            direction,
            minAmount,
            maxAmount,
            sortField = 'createdAt',
            sortOrder = 'desc',
            page,
            limit,
        } = getOperationsDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.OperationWhereInput = {
            deleted: false,
        };

        if (search) {
            where.description = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (typeId) {
            where.typeId = typeId;
        }
        if (userId) {
            where.userId = userId;
        }
        if (updatedById) {
            where.updatedById = updatedById;
        }
        if (conversionGroupId) {
            where.conversionGroupId = conversionGroupId;
        }

        if (walletId || direction || minAmount !== undefined || maxAmount !== undefined) {
            const entryWhere: Prisma.OperationEntryWhereInput = {
                deleted: false,
            };

            if (walletId) {
                entryWhere.walletId = walletId;
            }
            if (direction) {
                entryWhere.direction = direction;
            }

            if (minAmount !== undefined || maxAmount !== undefined) {
                entryWhere.amount = {};
                if (minAmount !== undefined) {
                    entryWhere.amount.gte = minAmount;
                }
                if (maxAmount !== undefined) {
                    entryWhere.amount.lte = maxAmount;
                }
            }

            where.entries = {
                some: entryWhere,
            };
        }

        const total = await this.prisma.operation.count({ where });

        const baseOptions = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
            include: {
                entries: {
                    where: { deleted: false },
                    select: {
                        id: true,
                        walletId: true,
                        direction: true,
                        amount: true,
                        before: true,
                        after: true,
                        userId: true,
                        updatedById: true,
                        createdAt: true,
                        updatedAt: true,
                        wallet: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
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
        } satisfies Prisma.OperationFindManyArgs;

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const operations = await this.prisma.operation.findMany(findManyOptions);

        const operationsResponse = operations.map(({ deleted: _, ...operation }) => operation);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            operations: operationsResponse,
            pagination: paginationResponse,
        };
    }
}
