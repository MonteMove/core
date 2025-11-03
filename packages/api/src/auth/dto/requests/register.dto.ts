import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { RoleCode } from '../../../../prisma/generated/prisma';

export class RegisterDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'newuser',
    minLength: 3,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_-]+$',
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @MinLength(3, {
    message: 'Имя пользователя должно содержать минимум 3 символа',
  })
  @MaxLength(50, {
    message: 'Имя пользователя не должно превышать 50 символов',
  })
  public username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 6,
    maxLength: 100,
    format: 'password',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
  public password: string;

  @ApiProperty({
    description: 'Роли пользователя',
    example: ['user'],
    enum: RoleCode,
    isArray: true,
    enumName: 'RoleCode',
  })
  @IsArray({ message: 'Роли должны быть массивом' })
  @IsEnum(RoleCode, {
    each: true,
    message: `Роль должна быть одной из: ${Object.values(RoleCode).join(', ')}`,
  })
  public roles: RoleCode[];
}
