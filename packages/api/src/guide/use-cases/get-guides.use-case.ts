import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetGuidesDto } from '../dto';
import { GetGuidesOutput } from '../types';

@Injectable()
export class GetGuidesUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getGuidesDto: GetGuidesDto): Promise<GetGuidesOutput> {
        const { search, userId, updatedById, sortField = 'createdAt', sortOrder = 'desc', page, limit } = getGuidesDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.GuideWhereInput = {
            deleted: false,
        };

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { cardNumber: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (userId) {
            where.userId = userId;
        }
        if (updatedById) {
            where.updatedById = updatedById;
        }

        const total = await this.prisma.guide.count({ where });

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
        };

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const guides = await this.prisma.guide.findMany(findManyOptions);

        const guidesResponse = guides.map(({ deleted: _, ...guide }) => guide);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            guides: guidesResponse,
            pagination: paginationResponse,
        };
    }
}
