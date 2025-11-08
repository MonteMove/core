import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetBanksDto {
    @ApiPropertyOptional({
        description: 'Поиск по названию или коду банка',
        example: 'Сбербанк',
    })
    @IsOptional()
    @IsString({ message: 'Поиск должен быть строкой' })
    public search?: string;

    @ApiPropertyOptional({
        description: 'Фильтр по активности',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }): boolean | undefined => {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        return value as boolean | undefined;
    })
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean;

    @ApiPropertyOptional({
        description: 'Показать удаленные банки',
        example: false,
    })
    @IsOptional()
    @Transform(({ value }): boolean | undefined => {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        return value as boolean | undefined;
    })
    @IsBoolean({ message: 'Удаление должно быть булевым значением' })
    public deleted?: boolean;
}
