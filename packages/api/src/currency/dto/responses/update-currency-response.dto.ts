import { ApiProperty } from '@nestjs/swagger';

import { CurrencyResponseDto } from './currency-response.dto';

export class UpdateCurrencyResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Валюта успешно обновлена',
  })
  public message: string;

  @ApiProperty({
    description: 'Информация об обновлённой валюте',
    type: CurrencyResponseDto,
  })
  public currency: CurrencyResponseDto;
}
