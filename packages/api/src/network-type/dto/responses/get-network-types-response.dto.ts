import { ApiProperty } from '@nestjs/swagger';

import { NetworkTypeResponseDto } from './network-type-response.dto';

export class PaginationDto {
    @ApiProperty({ description: 'Общее количество записей', example: 42 })
    public total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    public page: number;

    @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
    public limit: number;

    @ApiProperty({ description: 'Общее количество страниц', example: 5 })
    public totalPages: number;
}

export class GetNetworkTypesResponseDto {
    @ApiProperty({
        description: 'Список типов сетей',
        type: [NetworkTypeResponseDto],
    })
    public networkTypes: NetworkTypeResponseDto[];

    @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
    public pagination: PaginationDto;
}
