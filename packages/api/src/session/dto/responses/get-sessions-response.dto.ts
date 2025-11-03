import { ApiProperty } from '@nestjs/swagger';

import { SessionResponseDto } from './session-response.dto';

export class SessionsPaginationDto {
  @ApiProperty({ description: 'Общее количество записей', example: 25 })
  public total: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  public page: number;

  @ApiProperty({ description: 'Размер страницы', example: 10 })
  public limit: number;

  @ApiProperty({ description: 'Количество страниц', example: 3 })
  public totalPages: number;
}

export class GetSessionsResponseDto {
  @ApiProperty({ description: 'Список сессий', type: [SessionResponseDto] })
  public sessions: SessionResponseDto[];

  @ApiProperty({
    description: 'Информация о пагинации',
    type: SessionsPaginationDto,
  })
  public pagination: SessionsPaginationDto;
}
