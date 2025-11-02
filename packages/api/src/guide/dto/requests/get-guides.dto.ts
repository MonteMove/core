import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum GuideSortField {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    FULL_NAME = 'fullName',
    PHONE = 'phone',
    ADDRESS = 'address',
}

export class GetGuidesDto {
    @ApiProperty({
        description: 'Поиск по всем текстовым полям (description, fullName, phone, address, cardNumber)',
        example: 'Иванов',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Поиск должен быть строкой' })
    public search?: string;

    @ApiProperty({
        description: 'Фильтр по ID создателя',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Фильтр по ID создателя должен быть строкой' })
    public userId?: string;

    @ApiProperty({
        description: 'Фильтр по ID обновившего',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Фильтр по ID обновившего должен быть строкой' })
    public updatedById?: string;

    @ApiProperty({
        description: 'Поле для сортировки',
        enum: GuideSortField,
        example: GuideSortField.CREATED_AT,
        required: false,
    })
    @IsOptional()
    @IsEnum(GuideSortField, { message: 'Неверное поле для сортировки' })
    public sortField?: GuideSortField = GuideSortField.CREATED_AT;

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
        description: 'Размер страницы',
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
