import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';

const SYSTEM_WALLET_TYPE_CODES = ['inskech', 'bet11', 'vnj'];

@Injectable()
export class DeleteWalletTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(id: string): Promise<{ message: string }> {
        const existing = await this.prisma.walletType.findUnique({
            where: { id },
        });

        if (!existing || existing.deleted) {
            throw new NotFoundException('Тип кошелька не найден');
        }

        if (SYSTEM_WALLET_TYPE_CODES.includes(existing.code)) {
            throw new BadRequestException('Системный тип кошелька нельзя удалить');
        }

        await this.prisma.walletType.update({
            where: { id },
            data: { deleted: true },
        });

        return {
            message: 'Тип кошелька успешно удалён',
        };
    }
}
