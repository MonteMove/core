import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteCurrencyOutput } from '../types';

@Injectable()
export class DeleteCurrencyUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(currencyId: string, deletedById: string): Promise<DeleteCurrencyOutput> {
        const currency = await this.prisma.currency.findUnique({
            where: { id: currencyId },
            include: {
                wallets: {
                    where: { deleted: false },
                    select: { id: true },
                },
                applications: {
                    where: { deleted: false },
                    select: { id: true },
                },
            },
        });

        if (!currency || currency.deleted) {
            throw new NotFoundException('Валюта не найдена');
        }

        if (currency.wallets.length > 0) {
            throw new BadRequestException(
                `Нельзя удалить валюту, которая используется в ${currency.wallets.length} кошельках`,
            );
        }

        if (currency.applications.length > 0) {
            throw new BadRequestException(
                `Нельзя удалить валюту, которая используется в ${currency.applications.length} заявках`,
            );
        }

        await this.prisma.currency.update({
            where: { id: currencyId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Валюта успешно удалена',
        };
    }
}
