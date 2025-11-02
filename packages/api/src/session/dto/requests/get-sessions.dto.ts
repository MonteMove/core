import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum SessionSortField {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    EXPIRES_AT = 'expiresAt',
}

export class GetSessionsDto {
    @ApiPropertyOptional({ description: 'Номер страницы', example: 1, minimum: 1 })
    @IsOptional()
    @Transform(({ value }: { value: string }) => parseInt(value))
    @IsInt({ message: 'Страница должна быть числом' })
    @Min(1, { message: 'Страница должна быть больше 0' })
    public page?: number = 1;

    @ApiPropertyOptional({
        description: 'Количество элементов на странице',
        example: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Transform(({ value }: { value: string }) => parseInt(value))
    @IsInt({ message: 'Лимит должен быть числом' })
    @Min(1, { message: 'Лимит должен быть больше 0' })
    @Max(100, { message: 'Максимальный лимит - 100' })
    public limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Поле сортировки',
        enum: SessionSortField,
        example: SessionSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(SessionSortField, { message: 'Неверное поле для сортировки' })
    public sortField?: SessionSortField = SessionSortField.CREATED_AT;

    @ApiPropertyOptional({ description: 'Порядок сортировки', enum: SortOrder, example: SortOrder.DESC })
    @IsOptional()
    @IsEnum(SortOrder, { message: 'Неверный порядок сортировки' })
    public sortOrder?: SortOrder = SortOrder.DESC;

    @ApiPropertyOptional({ description: 'Фильтр по ID пользователя', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID('4', { message: 'ID пользователя должен быть валидным UUID' })
    public userId?: string;

    @ApiPropertyOptional({ description: 'Фильтр по статусу деактивации', example: false })
    @IsOptional()
    @Transform(({ value }: { value: string }) => value === 'true')
    @IsBoolean({ message: 'Статус отзыва должен быть булевым значением' })
    public revoked?: boolean;

    @ApiPropertyOptional({ description: 'Фильтр по IP адресу', example: '192.168.0.1' })
    @IsOptional()
    @IsString({ message: 'IP адрес должен быть строкой' })
    public ip?: string;
}
