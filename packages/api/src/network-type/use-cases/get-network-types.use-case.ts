import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common/services/prisma.service';
import {
  calculatePagination,
  createAllDataPaginationResponse,
  createPaginationResponse,
} from '../../common/utils';
import { GetNetworkTypesDto } from '../dto';
import { GetNetworkTypesResponse } from '../types';

@Injectable()
export class GetNetworkTypesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    getNetworkTypesDto: GetNetworkTypesDto,
  ): Promise<GetNetworkTypesResponse> {
    const {
      search,
      networkId,
      code,
      name,
      deleted,
      sortField = 'createdAt',
      sortOrder = 'desc',
      page,
      limit,
    } = getNetworkTypesDto;

    const pagination = calculatePagination({ page, limit });

    const where: Prisma.NetworkTypeWhereInput = {};

    if (deleted !== undefined) {
      where.deleted = deleted;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (networkId) {
      where.networkId = networkId;
    }

    if (code) {
      where.code = { contains: code, mode: 'insensitive' };
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const total = await this.prisma.networkType.count({ where });

    const baseOptions = {
      where,
      orderBy: {
        [sortField]: sortOrder,
      },
      include: {
        network: {
          select: {
            id: true,
            code: true,
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
    } satisfies Prisma.NetworkTypeFindManyArgs;

    const findManyOptions = pagination.shouldPaginate
      ? {
          ...baseOptions,
          skip: pagination.skip,
          take: pagination.take,
        }
      : baseOptions;

    const networkTypes =
      await this.prisma.networkType.findMany(findManyOptions);

    const paginationResponse = pagination.shouldPaginate
      ? createPaginationResponse(total, page!, limit!)
      : createAllDataPaginationResponse(total);

    return {
      networkTypes,
      pagination: paginationResponse,
    };
  }
}
