import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { GetCurrencyByIdOutput } from '../types';

@Injectable()
export class GetCurrencyByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(currencyId: string): Promise<GetCurrencyByIdOutput> {
        const currency = await this.prisma.currency.findUnique({
            where: { id: currencyId },
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
        });

        if (!currency || currency.deleted) {
            throw new NotFoundException('Валюта не найдена');
        }

        return {
            currency,
        };
    }
}
