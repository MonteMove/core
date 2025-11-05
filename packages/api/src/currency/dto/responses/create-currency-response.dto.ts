import { ApiProperty } from '@nestjs/swagger';

import { CurrencyResponseDto } from './currency-response.dto';

export class CreateCurrencyResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Валюта успешно создана',
    })
    public message: string;

    @ApiProperty({
        description: 'Информация о созданной валюте',
        type: CurrencyResponseDto,
    })
    public currency: CurrencyResponseDto;
}
