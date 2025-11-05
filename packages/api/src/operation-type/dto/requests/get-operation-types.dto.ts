import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum OperationTypeSortField {
    NAME = 'name',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class GetOperationTypesDto {
    @ApiProperty({
        description: 'Поиск по названию и описанию типа операции',
        example: 'вывод',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Строка поиска должна быть строкой' })
    public search?: string;

    @ApiProperty({
        description: 'Фильтр по названию (точное совпадение, без учёта регистра)',
        example: 'Вывод средств',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название должно быть строкой' })
    @MinLength(2, { message: 'Название должно содержать минимум 2 символа' })
    @MaxLength(100, { message: 'Название не должно превышать 100 символов' })
    public name?: string;

    @ApiProperty({
        description: 'Фильтр по ID пользователя, создавшего запись',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'ID пользователя должно быть строкой' })
    public userId?: string;

    @ApiProperty({
        description: 'Фильтр по ID пользователя, обновившего запись',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'ID обновившего пользователя должно быть строкой' })
    public updatedById?: string;

    @ApiProperty({
        description: 'Поле для сортировки',
        enum: OperationTypeSortField,
        example: OperationTypeSortField.CREATED_AT,
        required: false,
    })
    @IsOptional()
    @IsEnum(OperationTypeSortField, { message: 'Неверное поле для сортировки' })
    public sortField?: OperationTypeSortField = OperationTypeSortField.CREATED_AT;

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
