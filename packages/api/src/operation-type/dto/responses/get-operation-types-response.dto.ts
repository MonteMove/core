import { ApiProperty } from '@nestjs/swagger';

import { OperationTypeResponseDto } from './operation-type-response.dto';

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

export class GetOperationTypesResponseDto {
    @ApiProperty({ description: 'Список типов операций', type: [OperationTypeResponseDto] })
    public operationTypes: OperationTypeResponseDto[];

    @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
    public pagination: PaginationDto;
}
