import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
    @ApiProperty({ description: 'ID сессии', example: '123e4567-e89b-12d3-a456-426614174000' })
    public id: string;

    @ApiProperty({
        description: 'ID пользователя, которому принадлежит сессия',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public userId: string;

    @ApiProperty({ description: 'JWT идентификатор сессии (JTI)', example: 'jti-uuid' })
    public jti: string;

    @ApiProperty({ description: 'Дата истечения сессии', example: '2024-12-31T23:59:59.000Z' })
    public expiresAt: Date;

    @ApiProperty({ description: 'Флаг деактивации сессии', example: false })
    public revoked: boolean;

    @ApiProperty({
        description: 'User-Agent, с которого создана сессия',
        example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    })
    public userAgent: string | null;

    @ApiProperty({ description: 'IP-адрес клиента', example: '192.168.0.1', nullable: true })
    public ip: string | null;

    @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
    public createdAt: Date;

    @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
    public updatedAt: Date;
}
