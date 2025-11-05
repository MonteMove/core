import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetNetworksDto } from '../dto';
import { GetNetworksResponse } from '../types';

@Injectable()
export class GetNetworksUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getNetworksDto: GetNetworksDto): Promise<GetNetworksResponse> {
        const {
            search,
            code,
            name,
            userId,
            updatedById,
            deleted,
            sortField = 'createdAt',
            sortOrder = 'desc',
            page,
            limit,
        } = getNetworksDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.NetworkWhereInput = {
            deleted: deleted ?? false,
        };

        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (code) {
            where.code = { contains: code, mode: 'insensitive' };
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

        const total = await this.prisma.network.count({ where });

        const baseOptions = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
            include: {
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
        } satisfies Prisma.NetworkFindManyArgs;

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const networks = await this.prisma.network.findMany(findManyOptions);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            networks,
            pagination: paginationResponse,
        };
    }
}
