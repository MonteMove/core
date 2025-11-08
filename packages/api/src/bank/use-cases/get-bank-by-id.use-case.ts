import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { BankResponseDto } from '../dto';

@Injectable()
export class GetBankByIdUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(id: string): Promise<BankResponseDto> {
        const bank = await this.prisma.bank.findUnique({
            where: { id },
        });

        if (!bank) {
            throw new NotFoundException(`Банк с ID ${id} не найден`);
        }

        return bank;
    }
}
