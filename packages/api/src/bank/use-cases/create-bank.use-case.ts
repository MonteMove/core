import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateBankDto, BankResponseDto } from '../dto';

@Injectable()
export class CreateBankUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        createBankDto: CreateBankDto,
        userId: string,
    ): Promise<BankResponseDto> {
        const { code, name, active } = createBankDto;

        const existingBankByCode = await this.prisma.bank.findFirst({
            where: {
                code,
                deleted: false,
            },
        });

        if (existingBankByCode) {
            throw new BadRequestException(
                `Банк с кодом "${code}" уже существует`,
            );
        }

        const bank = await this.prisma.bank.create({
            data: {
                userId,
                updatedById: userId,
                code,
                name,
                active: active ?? true,
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
