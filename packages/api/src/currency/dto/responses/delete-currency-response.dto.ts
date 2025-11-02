import { ApiProperty } from '@nestjs/swagger';

export class DeleteCurrencyResponseDto {
    @ApiProperty({ description: 'Сообщение о результате операции', example: 'Валюта успешно удалена' })
    public message: string;
}
