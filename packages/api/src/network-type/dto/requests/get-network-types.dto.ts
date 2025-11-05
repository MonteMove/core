import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum NetworkTypeSortField {
    CODE = 'code',
    NAME = 'name',
    NETWORK_ID = 'networkId',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class GetNetworkTypesDto {
    @ApiProperty({
        description: 'Поиск по коду и названию типа сети',
        example: 'usdt',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Строка поиска должна быть строкой' })
    public search?: string;

    @ApiProperty({
        description: 'Фильтр по ID сети',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID сети должен быть валидным UUID' })
    public networkId?: string;

    @ApiProperty({
        description: 'Фильтр по коду типа сети (без учёта регистра)',
        example: 'TRC20',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Код типа сети должен быть строкой' })
    public code?: string;

    @ApiProperty({
        description: 'Фильтр по названию типа сети (без учёта регистра)',
        example: 'Tether',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название типа сети должно быть строкой' })
    public name?: string;

    @ApiProperty({
        description: 'Фильтр по удалённым типам сетей',
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
        enum: NetworkTypeSortField,
        example: NetworkTypeSortField.CREATED_AT,
        required: false,
    })
    @IsOptional()
    @IsEnum(NetworkTypeSortField, { message: 'Неверное поле для сортировки' })
    public sortField?: NetworkTypeSortField = NetworkTypeSortField.CREATED_AT;

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
        description: 'Номер страницы',
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
        description: 'Количество элементов на странице',
        example: 10,
        minimum: 1,
        maximum: 100,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Количество элементов должно быть числом' })
    @Min(1, { message: 'Количество элементов должно быть больше 0' })
    @Max(100, { message: 'Количество элементов не должно превышать 100' })
    public limit?: number = 10;
}
