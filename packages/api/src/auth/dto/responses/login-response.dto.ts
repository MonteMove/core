import { ApiProperty } from '@nestjs/swagger';

import { RoleCode } from '../../../../prisma/generated/prisma';

export class RoleResponseDto {
    @ApiProperty({
        description: 'ID роли',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string;

    @ApiProperty({
        description: 'Код роли',
        enum: RoleCode,
        example: RoleCode.user,
    })
    public code: RoleCode;

    @ApiProperty({ description: 'Название роли', example: 'Пользователь' })
    public name: string;

    @ApiProperty({ description: 'Роль удалена', example: false })
    public deleted: boolean;

    @ApiProperty({
        description: 'Дата создания',
        example: '2024-01-01T00:00:00.000Z',
    })
    public createdAt: Date;

    @ApiProperty({
        description: 'Дата обновления',
        example: '2024-01-01T00:00:00.000Z',
    })
    public updatedAt: Date;
}

export class AuthUserResponseDto {
    @ApiProperty({
        description: 'ID пользователя',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string;

    @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
    public username: string;

    @ApiProperty({
        description: 'Telegram ID',
        example: '123456789',
        nullable: true,
    })
    public telegramId: string | null;

    @ApiProperty({ description: 'Пользователь заблокирован', example: false })
    public blocked: boolean;

    @ApiProperty({ description: 'Пользователь удален', example: false })
    public deleted: boolean;

    @ApiProperty({ description: 'Telegram уведомления включены', example: false })
    public telegramNotifications: boolean;

    @ApiProperty({
        description: 'Последний вход',
        example: '2024-01-01T00:00:00.000Z',
        nullable: true,
    })
    public lastLogin: Date | null;

    @ApiProperty({
        description: 'Дата создания',
        example: '2024-01-01T00:00:00.000Z',
    })
    public createdAt: Date;

    @ApiProperty({
        description: 'Дата обновления',
        example: '2024-01-01T00:00:00.000Z',
    })
    public updatedAt: Date;

    @ApiProperty({ description: 'Роли пользователя', type: [RoleResponseDto] })
    public roles: RoleResponseDto[];
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT токен доступа',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    public accessToken: string;

    @ApiProperty({
        description: 'Информация о пользователе',
        type: AuthUserResponseDto,
    })
    public user: AuthUserResponseDto;

    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Успешный вход в систему',
    })
    public message: string;
}
