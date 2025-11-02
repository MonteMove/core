import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { WalletType } from '../../../../prisma/generated/prisma';

export class GetClosingPeriodReportDto {
    @ApiPropertyOptional({ description: 'Фильтр по типу кошелька', enum: WalletType })
    @IsOptional()
    @IsEnum(WalletType)
    public walletType?: WalletType;
}
