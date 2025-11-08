import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { BankResponseDto } from '../dto';

@Injectable()
export class DeleteBankUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(id: string, userId: string): Promise<BankResponseDto> {
        const existingBank = await this.prisma.bank.findUnique({
            where: { id },
        });

        if (!existingBank || existingBank.deleted) {
            throw new NotFoundException('Банк не найден');
        }

        const bank = await this.prisma.bank.update({
            where: { id },
            data: {
                deleted: true,
                updatedById: userId,
            },
        });

        return {
            id: bank.id,
            name: bank.name,
            code: bank.code,
            active: bank.active,
            deleted: bank.deleted,
            createdAt: bank.createdAt,
            updatedAt: bank.updatedAt,
        };
    }
}
