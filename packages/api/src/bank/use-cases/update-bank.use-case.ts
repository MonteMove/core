import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { BankResponseDto, UpdateBankDto } from '../dto';

@Injectable()
export class UpdateBankUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        id: string,
        updateBankDto: UpdateBankDto,
        userId: string,
    ): Promise<BankResponseDto> {
        const existingBank = await this.prisma.bank.findUnique({
            where: { id },
        });

        if (!existingBank || existingBank.deleted) {
            throw new NotFoundException('Банк не найден');
        }

        if (updateBankDto.code && updateBankDto.code !== existingBank.code) {
            const bankWithCode = await this.prisma.bank.findFirst({
                where: {
                    code: updateBankDto.code,
                    deleted: false,
                    id: { not: id },
                },
            });

            if (bankWithCode) {
                throw new BadRequestException(
                    `Банк с кодом "${updateBankDto.code}" уже существует`,
                );
            }
        }

        const bank = await this.prisma.bank.update({
            where: { id },
            data: {
                ...updateBankDto,
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
