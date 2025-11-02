import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetUsersDto } from '../dto';
import { GetUsersOutput } from '../types';

@Injectable()
export class GetUsersUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getUsersDto: GetUsersDto): Promise<GetUsersOutput> {
        const {
            search,
            roleCode,
            blocked,
            telegramNotifications,
            telegramId,
            sortField = 'createdAt',
            sortOrder = 'desc',
            page,
            limit,
        } = getUsersDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.UserWhereInput = {
            deleted: false,
        };

        if (search) {
            where.username = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (blocked !== undefined) {
            where.blocked = blocked;
        }

        if (telegramNotifications !== undefined) {
            where.telegramNotifications = telegramNotifications;
        }

        if (telegramId) {
            where.telegramId = { contains: telegramId, mode: 'insensitive' };
        }

        if (roleCode) {
            where.roles = {
                some: {
                    code: roleCode,
                    deleted: false,
                },
            };
        }

        const total = await this.prisma.user.count({ where });

        const baseOptions = {
            where,
            orderBy: {
                [sortField]: sortOrder,
            },
            include: {
                roles: {
                    where: { deleted: false },
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        createdAt: true,
                        updatedAt: true,
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

        const users = await this.prisma.user.findMany(findManyOptions);

        const usersResponse = users.map(({ deleted, passwordHash, ...user }) => user);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            users: usersResponse,
            pagination: paginationResponse,
        };
    }
}
