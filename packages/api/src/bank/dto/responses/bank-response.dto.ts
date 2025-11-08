import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BankResponseDto {
    @ApiProperty({
        description: 'ID банка',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    public id: string;

    @ApiProperty({ description: 'Название банка', example: 'Сбербанк' })
    public name: string;

    @ApiProperty({ description: 'Код банка', example: 'sber' })
    public code: string;

    @ApiProperty({
        description: 'Активность банка',
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
