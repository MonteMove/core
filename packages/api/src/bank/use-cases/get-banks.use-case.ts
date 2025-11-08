import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/prisma';

import { PrismaService } from '../../common/services/prisma.service';
import { GetBanksDto, GetBanksResponseDto } from '../dto';

@Injectable()
export class GetBanksUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(getBanksDto: GetBanksDto): Promise<GetBanksResponseDto> {
        const { search, active, deleted } = getBanksDto;

        const where: Prisma.BankWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (active !== undefined) {
            where.active = active;
        }

        if (deleted !== undefined) {
            where.deleted = deleted;
        } else {
            where.deleted = false;
        }

        const banks = await this.prisma.bank.findMany({
            where,
            orderBy: [{ active: 'desc' }, { name: 'asc' }],
        });

        return {
            banks,
        };
    }
}
