import { ApiProperty } from '@nestjs/swagger';

import { OperationResponseDto } from './operation-response.dto';

export class PaginationDto {
  @ApiProperty({ description: 'Общее количество записей', example: 120 })
  public total: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  public page: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: 10 })
  public limit: number;

  @ApiProperty({ description: 'Общее количество страниц', example: 12 })
  public totalPages: number;
}

export class GetOperationsResponseDto {
  @ApiProperty({ description: 'Список операций', type: [OperationResponseDto] })
  public operations: OperationResponseDto[];

  @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
  public pagination: PaginationDto;
}
