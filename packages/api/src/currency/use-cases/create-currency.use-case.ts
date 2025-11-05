import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateCurrencyDto } from '../dto';
import { CreateCurrencyOutput } from '../types';

@Injectable()
export class CreateCurrencyUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(createCurrencyDto: CreateCurrencyDto, userId: string): Promise<CreateCurrencyOutput> {
        const { code, name } = createCurrencyDto;

        const existingCurrencyByCode = await this.prisma.currency.findFirst({
            where: {
                code,
                deleted: false,
            },
        });

        if (existingCurrencyByCode) {
            throw new BadRequestException(`Валюта с кодом "${code}" уже существует`);
        }

        const existingCurrencyByName = await this.prisma.currency.findFirst({
            where: {
                name,
                deleted: false,
            },
        });

        if (existingCurrencyByName) {
            throw new BadRequestException(`Валюта с названием "${name}" уже существует`);
        }

        const currency = await this.prisma.currency.create({
            data: {
                userId,
                updatedById: userId,
                code,
                name,
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

        return {
            message: 'Валюта успешно создана',
            currency,
        };
    }
}
