import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum CurrencySortField {
    CODE = 'code',
    NAME = 'name',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class GetCurrenciesDto {
    @ApiProperty({
        description: 'Поиск по коду или названию валюты',
        example: 'usd',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Поисковый запрос должен быть строкой' })
    public search?: string;

    @ApiProperty({
        description: 'Фильтр по коду валюты',
        example: 'USD',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Код валюты должен быть строкой' })
    public code?: string;

    @ApiProperty({
        description: 'Фильтр по удалённым валютам',
        example: false,
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'boolean') {
            return value;
        }
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }

        return undefined;
    })
    @IsBoolean({ message: 'Флаг удаления должен быть булевым значением' })
    public deleted?: boolean;

    @ApiProperty({
        description: 'Поле для сортировки',
        enum: CurrencySortField,
        example: CurrencySortField.CREATED_AT,
        required: false,
    })
    @IsOptional()
    @IsEnum(CurrencySortField, { message: 'Неверное поле для сортировки' })
    public sortField?: CurrencySortField = CurrencySortField.CREATED_AT;

    @ApiProperty({
        description: 'Порядок сортировки',
        enum: SortOrder,
        example: SortOrder.DESC,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortOrder, { message: 'Неверный порядок сортировки' })
    public sortOrder?: SortOrder = SortOrder.DESC;

    @ApiProperty({
        description: 'Номер страницы (для пагинации)',
        example: 1,
        minimum: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Номер страницы должен быть числом' })
    @Min(1, { message: 'Номер страницы должен быть больше 0' })
    public page?: number = 1;

    @ApiProperty({
        description: 'Размер страницы (для пагинации)',
        example: 10,
        minimum: 1,
        maximum: 100,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Размер страницы должен быть числом' })
    @Min(1, { message: 'Размер страницы должен быть больше 0' })
    @Max(100, { message: 'Размер страницы не должен превышать 100' })
    public limit?: number = 10;
}
