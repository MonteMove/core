import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlatformResponseDto {
    @ApiProperty({
        description: 'ID платформы',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string;

    @ApiProperty({ description: 'Название платформы', example: 'Bybit' })
    public name: string;

    @ApiProperty({ description: 'Код платформы', example: 'BYBIT' })
    public code: string;

    @ApiPropertyOptional({
        description: 'Описание платформы',
        example: 'Криптовалютная биржа',
        nullable: true,
    })
    public description?: string | null;

    @ApiPropertyOptional({
        description: 'URL иконки платформы',
        example: 'https://example.com/icon.png',
        nullable: true,
    })
    public icon?: string | null;

    @ApiPropertyOptional({
        description: 'URL сайта платформы',
        example: 'https://www.bybit.com',
        nullable: true,
    })
    public url?: string | null;

    @ApiProperty({
        description: 'Активность платформы',
        example: true,
    })
    public active: boolean;

    @ApiProperty({
        description: 'Флаг удаления записи',
        example: false,
    })
    public deleted: boolean;

    @ApiProperty({
        description: 'Дата создания записи',
        example: '2024-01-01T00:00:00.000Z',
    })
    public createdAt: Date;

    @ApiProperty({
        description: 'Дата последнего обновления записи',
        example: '2024-01-02T00:00:00.000Z',
    })
    public updatedAt: Date;
}
