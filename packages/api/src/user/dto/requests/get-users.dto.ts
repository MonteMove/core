import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { RoleCode } from '../../../../prisma/generated/prisma';
import { SortOrder } from '../../../common/enums';

export enum UserSortField {
  USERNAME = 'username',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LAST_LOGIN = 'lastLogin',
}

export class GetUsersDto {
  @ApiProperty({
    description: 'Поиск по имени пользователя',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Поиск должен быть строкой' })
  public search?: string;

  @ApiProperty({
    description: 'Фильтр по роли',
    enum: RoleCode,
    example: RoleCode.user,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoleCode, { message: 'Неверный код роли' })
  public roleCode?: RoleCode;

  @ApiProperty({
    description: 'Фильтр по статусу блокировки',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Статус блокировки должен быть boolean' })
  @Type(() => Boolean)
  public blocked?: boolean;

  @ApiProperty({
    description: 'Фильтр по статусу Telegram уведомлений',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Статус Telegram уведомлений должен быть boolean' })
  @Type(() => Boolean)
  public telegramNotifications?: boolean;

  @ApiProperty({
    description: 'Фильтр по Telegram ID',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telegram ID должен быть строкой' })
  public telegramId?: string;

  @ApiProperty({
    description: 'Фильтр по статусу держателя кошельков',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Статус держателя должен быть boolean' })
  @Type(() => Boolean)
  public isHolder?: boolean;

  @ApiProperty({
    description: 'Фильтр по статусу курьера',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Статус курьера должен быть boolean' })
  @Type(() => Boolean)
  public isCourier?: boolean;

  @ApiProperty({
    description: 'Поле для сортировки',
    enum: UserSortField,
    example: UserSortField.CREATED_AT,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserSortField, { message: 'Неверное поле для сортировки' })
  public sortField?: UserSortField = UserSortField.CREATED_AT;

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
