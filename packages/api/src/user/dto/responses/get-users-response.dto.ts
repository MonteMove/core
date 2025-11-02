import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class PaginationDto {
    @ApiProperty({ description: 'Общее количество элементов', example: 100 })
    public total: number;

    @ApiProperty({ description: 'Номер текущей страницы', example: 1 })
    public page: number;

    @ApiProperty({ description: 'Размер страницы', example: 10 })
    public limit: number;

    @ApiProperty({ description: 'Общее количество страниц', example: 10 })
    public totalPages: number;
}

export class GetUsersResponseDto {
    @ApiProperty({ description: 'Список пользователей', type: [UserResponseDto] })
    public users: UserResponseDto[];

    @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
    public pagination: PaginationDto;
}
