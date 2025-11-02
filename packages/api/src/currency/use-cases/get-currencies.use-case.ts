import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import { calculatePagination, createAllDataPaginationResponse, createPaginationResponse } from '../../common/utils';
import { GetCurrenciesDto } from '../dto';
import { GetCurrenciesOutput } from '../types';

@Injectable()
export class GetCurrenciesUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getCurrenciesDto: GetCurrenciesDto): Promise<GetCurrenciesOutput> {
        const { search, code, sortField = 'createdAt', sortOrder = 'desc', page, limit } = getCurrenciesDto;

        const pagination = calculatePagination({ page, limit });

        const where: Prisma.CurrencyWhereInput = {
            deleted: false,
        };

        if (search) {
            where.OR = [
                {
                    code: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        if (code) {
            where.code = {
                contains: code,
                mode: 'insensitive',
            };
        }

        const total = await this.prisma.currency.count({ where });

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
        } satisfies Prisma.CurrencyFindManyArgs;

        const findManyOptions = pagination.shouldPaginate
            ? {
                  ...baseOptions,
                  skip: pagination.skip,
                  take: pagination.take,
              }
            : baseOptions;

        const currencies = await this.prisma.currency.findMany(findManyOptions);

        const currenciesResponse = currencies.map(({ deleted: _, ...currency }) => currency);

        const paginationResponse = pagination.shouldPaginate
            ? createPaginationResponse(total, page!, limit!)
            : createAllDataPaginationResponse(total);

        return {
            currencies: currenciesResponse,
            pagination: paginationResponse,
        };
    }
}
