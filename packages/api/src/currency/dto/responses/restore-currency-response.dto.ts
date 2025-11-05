import { ApiProperty } from '@nestjs/swagger';

export class RestoreCurrencyResponseDto {
    @ApiProperty({
        description: 'Сообщение об успешном восстановлении',
        example: 'Валюта успешно восстановлена',
    })
    public message: string;
}
