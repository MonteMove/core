import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseDto {
    @ApiProperty({ description: 'ID валюты', example: '123e4567-e89b-12d3-a456-426614174000' })
    public id: string;

    @ApiProperty({ description: 'Код валюты', example: 'USD' })
    public code: string;

    @ApiProperty({ description: 'Название валюты', example: 'Доллар США' })
    public name: string;

    @ApiProperty({ description: 'ID пользователя, создавшего запись', example: '123e4567-e89b-12d3-a456-426614174000' })
    public userId: string;

    @ApiProperty({
        description: 'ID пользователя, обновившего запись',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public updatedById: string;

    @ApiProperty({ description: 'Дата создания записи', example: '2024-01-01T00:00:00.000Z' })
    public createdAt: Date;

    @ApiProperty({ description: 'Дата последнего обновления записи', example: '2024-01-02T00:00:00.000Z' })
    public updatedAt: Date;
}
