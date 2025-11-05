import { ApiProperty } from '@nestjs/swagger';

import { RoleCode } from '../../../../prisma/generated/prisma';

export class UserRoleResponseDto {
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

    @ApiProperty({
        description: 'Дата создания роли',
        example: '2024-01-01T00:00:00.000Z',
    })
    public createdAt: Date;

    @ApiProperty({
        description: 'Дата обновления роли',
        example: '2024-01-01T00:00:00.000Z',
    })
    public updatedAt: Date;
}

export class UserResponseDto {
    @ApiProperty({
        description: 'ID пользователя',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string;

    @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
    public username: string;

    @ApiProperty({
        description: 'Telegram ID пользователя',
        example: '123456789',
        nullable: true,
    })
    public telegramId: string | null;

    @ApiProperty({
        description: 'Статус блокировки пользователя',
        example: false,
    })
    public blocked: boolean;

    @ApiProperty({
        description: 'Является ли пользователь держателем кошелька',
        example: false,
    })
    public isHolder: boolean;

    @ApiProperty({
        description: 'Является ли пользователь курьером',
        example: false,
    })
    public isCourier: boolean;

    @ApiProperty({ description: 'Статус Telegram уведомлений', example: true })
    public telegramNotifications: boolean;

    @ApiProperty({
        description: 'Дата последнего входа',
        example: '2024-01-01T00:00:00.000Z',
        nullable: true,
    })
    public lastLogin: Date | null;

    @ApiProperty({
        description: 'Дата создания пользователя',
        example: '2024-01-01T00:00:00.000Z',
    })
    public createdAt: Date;

    @ApiProperty({
        description: 'Дата обновления пользователя',
        example: '2024-01-01T00:00:00.000Z',
    })
    public updatedAt: Date;

    @ApiProperty({
        description: 'Роли пользователя',
        type: [UserRoleResponseDto],
    })
    public roles: UserRoleResponseDto[];
}
