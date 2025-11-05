import { ApiProperty } from '@nestjs/swagger';

import { ApplicationResponseDto } from './application-response.dto';

export class PaginationDto {
    @ApiProperty({ description: 'Общее количество записей', example: 100 })
    public total: number;

    @ApiProperty({ description: 'Текущая страница', example: 1 })
    public page: number;

    @ApiProperty({ description: 'Размер страницы', example: 10 })
    public limit: number;

    @ApiProperty({ description: 'Общее количество страниц', example: 10 })
    public totalPages: number;
}

export class GetApplicationsResponseDto {
    @ApiProperty({ description: 'Список заявок', type: [ApplicationResponseDto] })
    public applications: ApplicationResponseDto[];

    @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
    public pagination: PaginationDto;
}
