import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'Имя пользователя',
        example: 'admin',
        minLength: 3,
        maxLength: 50,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Имя пользователя должно быть строкой' })
    @MinLength(3, {
        message: 'Имя пользователя должно содержать минимум 3 символа',
    })
    @MaxLength(50, {
        message: 'Имя пользователя не должно превышать 50 символов',
    })
    public username?: string;

    @ApiProperty({
        description: 'Telegram ID пользователя',
        example: '123456789',
        maxLength: 50,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Telegram ID должен быть строкой' })
    @MaxLength(50, { message: 'Telegram ID не должен превышать 50 символов' })
    public telegramId?: string;

    @ApiProperty({
        description: 'Статус блокировки пользователя',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Статус блокировки должен быть boolean' })
    public blocked?: boolean;

    @ApiProperty({
        description: 'Статус Telegram уведомлений',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Статус Telegram уведомлений должен быть boolean' })
    public telegramNotifications?: boolean;

    @ApiProperty({
        description: 'Является ли пользователь держателем',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Статус держателя должен быть boolean' })
    public isHolder?: boolean;

    @ApiProperty({
        description: 'Является ли пользователь курьером',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Статус курьера должен быть boolean' })
    public isCourier?: boolean;

    @ApiProperty({
        description: 'Пароль пользователя',
        example: 'newPassword123',
        minLength: 8,
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
    @MaxLength(100, { message: 'Пароль не должен превышать 100 символов' })
    public password?: string;

    @ApiProperty({
        description: 'Список ID ролей пользователя',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        required: false,
    })
    @IsOptional()
    @IsUUID('4', {
        each: true,
        message: 'Каждый ID роли должен быть валидным UUID',
    })
    public roleIds?: string[];
}
