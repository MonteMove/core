import { ApiProperty } from '@nestjs/swagger';

import { CurrencyResponseDto } from './currency-response.dto';

export class PaginationDto {
  @ApiProperty({ description: 'Общее количество записей', example: 42 })
  public total: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  public page: number;

  @ApiProperty({ description: 'Размер страницы', example: 10 })
  public limit: number;

  @ApiProperty({ description: 'Общее количество страниц', example: 5 })
  public totalPages: number;
}

export class GetCurrenciesResponseDto {
  @ApiProperty({ description: 'Список валют', type: [CurrencyResponseDto] })
  public currencies: CurrencyResponseDto[];

  @ApiProperty({ description: 'Информация о пагинации', type: PaginationDto })
  public pagination: PaginationDto;
}
