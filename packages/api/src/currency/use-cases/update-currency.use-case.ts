import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateCurrencyDto } from '../dto';
import { UpdateCurrencyOutput } from '../types';

@Injectable()
export class UpdateCurrencyUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        currencyId: string,
        updateCurrencyDto: UpdateCurrencyDto,
        updatedById: string,
    ): Promise<UpdateCurrencyOutput> {
        const { code, name } = updateCurrencyDto;

        const existingCurrency = await this.prisma.currency.findUnique({
            where: { id: currencyId },
        });

        if (!existingCurrency || existingCurrency.deleted) {
            throw new NotFoundException('Валюта не найдена');
        }

        if (code !== undefined && code !== existingCurrency.code) {
            const currencyWithCode = await this.prisma.currency.findFirst({
                where: {
                    code,
                    deleted: false,
                    id: {
                        not: currencyId,
                    },
                },
            });

            if (currencyWithCode) {
                throw new BadRequestException(`Валюта с кодом "${code}" уже существует`);
            }
        }

        if (name !== undefined && name !== existingCurrency.name) {
            const currencyWithName = await this.prisma.currency.findFirst({
                where: {
                    name,
                    deleted: false,
                    id: {
                        not: currencyId,
                    },
                },
            });

            if (currencyWithName) {
                throw new BadRequestException(`Валюта с названием "${name}" уже существует`);
            }
        }

        const currency = await this.prisma.currency.update({
            where: { id: currencyId },
            data: {
                updatedById,
                ...(code !== undefined && { code }),
                ...(name !== undefined && { name }),
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
        });

        const { deleted: _, ...currencyResponse } = currency;

        return {
            message: 'Валюта успешно обновлена',
            currency: currencyResponse,
        };
    }
}
