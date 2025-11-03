import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { OperationDirection } from '../../../../prisma/generated/prisma';
import { SortOrder } from '../../../common/enums';

export enum OperationSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DESCRIPTION = 'description',
}

export class GetOperationsDto {
  @ApiProperty({
    description: 'Поиск по описанию операции',
    example: 'перевод',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поиск по описанию должен быть строкой' })
  public search?: string;

  @ApiProperty({
    description: 'Фильтр по типу операции',
    example: '123e4567-e89b-12d3-a456-426614174101',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID типа операции должен быть валидным UUID' })
  public typeId?: string;

  @ApiProperty({
    description: 'Фильтр по ID создателя операции',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID создателя должен быть валидным UUID' })
  public userId?: string;

  @ApiProperty({
    description: 'Фильтр по ID пользователя, обновившего операцию',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID обновившего должен быть валидным UUID' })
  public updatedById?: string;

  @ApiProperty({
    description: 'Фильтр по ID группы конверсии',
    example: 7,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'ID группы конверсии должен быть числом' })
  @Min(1, { message: 'ID группы конверсии должен быть больше 0' })
  public conversionGroupId?: number;

  @ApiProperty({
    description: 'Фильтр по ID кошелька из записей операции',
    example: '123e4567-e89b-12d3-a456-426614174010',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID кошелька должен быть валидным UUID' })
  public walletId?: string;

  @ApiProperty({
    description: 'Фильтр по направлению записи',
    enum: OperationDirection,
    required: false,
  })
  @IsOptional()
  @IsEnum(OperationDirection, { message: 'Неверное направление операции' })
  public direction?: OperationDirection;

  @ApiProperty({
    description: 'Минимальная сумма записи',
    example: 100,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Минимальная сумма должна быть числом' })
  @Min(0, { message: 'Минимальная сумма не может быть отрицательной' })
  public minAmount?: number;

  @ApiProperty({
    description: 'Максимальная сумма записи',
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
    description: 'Поле для сортировки',
    enum: OperationSortField,
    example: OperationSortField.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsEnum(OperationSortField, { message: 'Неверное поле для сортировки' })
  public sortField?: OperationSortField = OperationSortField.CREATED_AT;

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
    description: 'Номер страницы (>=1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Номер страницы должен быть числом' })
  @Min(1, { message: 'Номер страницы должен быть больше 0' })
  public page?: number = 1;

  @ApiProperty({
    description: 'Количество элементов на странице (1-100)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Размер страницы должен быть числом' })
  @Min(1, { message: 'Размер страницы должен быть больше 0' })
  @Max(100, { message: 'Размер страницы не должен превышать 100' })
  public limit?: number = 10;
}
