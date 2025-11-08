import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { UpdateWalletTypeDto, WalletTypeResponseDto } from '../dto';

const SYSTEM_WALLET_TYPE_CODES = ['inskech', 'bet11', 'vnj'];

@Injectable()
export class UpdateWalletTypeUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(
        id: string,
        dto: UpdateWalletTypeDto,
    ): Promise<{ message: string; walletType: WalletTypeResponseDto }> {
        const existing = await this.prisma.walletType.findUnique({
            where: { id },
        });

        if (!existing || existing.deleted) {
            throw new NotFoundException('Тип кошелька не найден');
        }

        if (dto.code !== undefined && SYSTEM_WALLET_TYPE_CODES.includes(existing.code) && dto.code !== existing.code) {
            throw new BadRequestException('Нельзя изменить код системного типа кошелька');
        }

        if (dto.code && dto.code !== existing.code) {
            const codeExists = await this.prisma.walletType.findUnique({
                where: { code: dto.code },
            });

            if (codeExists) {
                throw new ConflictException(`Тип кошелька с кодом "${dto.code}" уже существует`);
            }
        }

        const walletType = await this.prisma.walletType.update({
            where: { id },
            data: {
                ...(dto.code !== undefined && { code: dto.code }),
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.showInTabs !== undefined && { showInTabs: dto.showInTabs }),
                ...(dto.tabOrder !== undefined && { tabOrder: dto.tabOrder }),
                ...(dto.active !== undefined && { active: dto.active }),
            },
        });

        return {
            message: 'Тип кошелька успешно обновлён',
            walletType,
        };
    }
}
