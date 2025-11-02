import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetSessionsDto } from '../dto';
import { GetSessionsOutput } from '../types';

@Injectable()
export class GetSessionsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(dto: GetSessionsDto): Promise<GetSessionsOutput> {
        const { page, limit, sortField = 'createdAt', sortOrder = 'desc', userId, revoked, ip } = dto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.SessionWhereInput = {};

        if (userId) {
            where.userId = userId;
        }

        if (revoked !== undefined) {
            where.revoked = revoked;
        }

        if (ip) {
            where.ip = {
                contains: ip,
                mode: 'insensitive',
            };
        }

        const orderBy: Prisma.SessionOrderByWithRelationInput = {
            [sortField]: sortOrder,
        };

        const findManyOptions: Prisma.SessionFindManyArgs = {
            where,
            orderBy,
            select: {
                id: true,
                userId: true,
                jti: true,
                expiresAt: true,
                revoked: true,
                userAgent: true,
                ip: true,
                createdAt: true,
                updatedAt: true,
            },
        };

        if (pagination.shouldPaginate) {
            findManyOptions.skip = pagination.skip;
            findManyOptions.take = pagination.take;
        }

        const [sessions, total] = await Promise.all([
            this.prisma.session.findMany(findManyOptions),
            this.prisma.session.count({ where }),
        ]);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            sessions,
            pagination: paginationResponse,
        };
    }
}
