import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { SortOrder } from '../../../common/enums';

export enum NetworkSortField {
  CODE = 'code',
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class GetNetworksDto {
  @ApiProperty({
    description: 'Поиск по коду и названию сети',
    example: 'eth',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Строка поиска должна быть строкой' })
  public search?: string;

  @ApiProperty({
    description: 'Фильтр по коду сети',
    example: 'ETH',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Код сети должен быть строкой' })
  public code?: string;

  @ApiProperty({
    description: 'Фильтр по названию сети',
    example: 'Ethereum',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Название сети должно быть строкой' })
  public name?: string;

  @ApiProperty({
    description: 'Фильтр по ID создателя записи',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID создателя должен быть строкой' })
  public userId?: string;

  @ApiProperty({
    description: 'Фильтр по ID пользователя, обновившего запись',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID обновившего пользователя должен быть строкой' })
  public updatedById?: string;

  @ApiProperty({
    description: 'Фильтр по удалённым сетям',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Флаг удаления должен быть булевым значением' })
  public deleted?: boolean;

  @ApiProperty({
    description: 'Поле для сортировки',
    enum: NetworkSortField,
    example: NetworkSortField.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsEnum(NetworkSortField, { message: 'Неверное поле для сортировки' })
  public sortField?: NetworkSortField = NetworkSortField.CREATED_AT;

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
