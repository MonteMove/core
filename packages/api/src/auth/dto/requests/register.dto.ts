import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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
        description: 'Пароль пользователя (минимум 8 символов, должен содержать буквы и цифры)',
        example: 'Password123',
        minLength: 8,
        maxLength: 100,
        format: 'password',
    })
    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
    @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
    @Matches(/[A-Za-z]/, { message: 'Пароль должен содержать хотя бы одну букву' })
    @Matches(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
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
