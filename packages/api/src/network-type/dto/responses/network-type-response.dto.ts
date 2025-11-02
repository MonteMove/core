import { ApiProperty } from '@nestjs/swagger';

export class NetworkSummaryDto {
    @ApiProperty({ description: 'ID сети', example: '123e4567-e89b-12d3-a456-426614174000' })
    public id: string;

    @ApiProperty({ description: 'Код сети', example: 'ETH' })
    public code: string;

    @ApiProperty({ description: 'Название сети', example: 'Ethereum' })
    public name: string;
}

export class NetworkTypeResponseDto {
    @ApiProperty({ description: 'ID типа сети', example: '123e4567-e89b-12d3-a456-426614174001' })
    public id: string;

    @ApiProperty({ description: 'ID сети, к которой относится тип', example: '123e4567-e89b-12d3-a456-426614174000' })
    public networkId: string;

    @ApiProperty({ description: 'Код типа сети', example: 'TRC20' })
    public code: string;

    @ApiProperty({ description: 'Название типа сети', example: 'Tether USDT (TRC-20)' })
    public name: string;

    @ApiProperty({ description: 'ID пользователя, создавшего запись', example: '123e4567-e89b-12d3-a456-426614174999' })
    public userId: string;

    @ApiProperty({
        description: 'ID пользователя, обновившего запись',
        example: '123e4567-e89b-12d3-a456-426614174998',
    })
    public updatedById: string;

    @ApiProperty({ description: 'Дата создания записи', example: '2024-01-01T00:00:00.000Z' })
    public createdAt: Date;

    @ApiProperty({ description: 'Дата последнего обновления записи', example: '2024-01-02T00:00:00.000Z' })
    public updatedAt: Date;

    @ApiProperty({ description: 'Информация о сети', type: NetworkSummaryDto })
    public network: NetworkSummaryDto;
}
