import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetClosingPeriodReportDto {
    @ApiPropertyOptional({
        description: 'Фильтр по коду типа кошелька',
        example: 'inskech',
    })
    @IsOptional()
    @IsString()
    public walletTypeCode?: string;
}
