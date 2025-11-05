import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

import { ApplicationStatus } from '../../../../prisma/generated/prisma';
import { SortOrder } from '../../../common/enums';

export enum ApplicationSortField {
    STATUS = 'status',
    AMOUNT = 'amount',
    MEETING_DATE = 'meetingDate',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class GetApplicationsDto {
    @ApiProperty({
        description: 'Поиск по всем текстовым полям (description, phone, telegramUsername)',
        example: 'Обмен валют',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Поиск должен быть строкой' })
    public search?: string;

    @ApiProperty({
        description: 'Фильтр по статусу заявки',
        enum: ApplicationStatus,
        example: ApplicationStatus.open,
        required: false,
    })
    @IsOptional()
    @IsEnum(ApplicationStatus, { message: 'Неверный статус заявки' })
    public status?: ApplicationStatus;

    @ApiProperty({
        description: 'Минимальная сумма заявки',
        example: 1000,
        minimum: 0,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Минимальная сумма должна быть числом' })
    @Min(0, { message: 'Минимальная сумма не может быть отрицательной' })
    public minAmount?: number;

    @ApiProperty({
        description: 'Максимальная сумма заявки',
        example: 10000,
        minimum: 0,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Максимальная сумма должна быть числом' })
    @Min(0, { message: 'Максимальная сумма не может быть отрицательной' })
    public maxAmount?: number;

    @ApiProperty({
        description: 'Фильтр по ID валюты',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID валюты должен быть валидным UUID' })
    public currencyId?: string;

    @ApiProperty({
        description: 'Фильтр по ID типа операции',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID типа операции должен быть валидным UUID' })
    public operationTypeId?: string;

    @ApiProperty({
        description: 'Фильтр по ID создателя',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID создателя должен быть валидным UUID' })
    public userId?: string;

    @ApiProperty({
        description: 'Фильтр по ID исполнителя',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID исполнителя должен быть валидным UUID' })
    public assigneeUserId?: string;

    @ApiProperty({
        description: 'Фильтр по ID обновившего',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID обновившего должен быть валидным UUID' })
    public updatedById?: string;

    @ApiProperty({
        description: 'Фильтр от даты создания',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата от должна быть валидной датой' })
    public createdFrom?: string;

    @ApiProperty({
        description: 'Фильтр до даты создания',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата до должна быть валидной датой' })
    public createdTo?: string;

    @ApiProperty({
        description: 'Фильтр от даты встречи',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата встречи от должна быть валидной датой' })
    public meetingDateFrom?: string;

    @ApiProperty({
        description: 'Фильтр до даты встречи',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата встречи до должна быть валидной датой' })
    public meetingDateTo?: string;

    @ApiProperty({
        description: 'Поле для сортировки',
        enum: ApplicationSortField,
        example: ApplicationSortField.CREATED_AT,
        required: false,
    })
    @IsOptional()
    @IsEnum(ApplicationSortField, { message: 'Неверное поле для сортировки' })
    public sortField?: ApplicationSortField = ApplicationSortField.CREATED_AT;

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
