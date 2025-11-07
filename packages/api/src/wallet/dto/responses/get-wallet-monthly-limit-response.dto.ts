import { ApiProperty } from '@nestjs/swagger';

export class GetWalletMonthlyLimitResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Месячный лимит успешно получен',
    })
    public message: string;

    @ApiProperty({
        description: 'Установленный месячный лимит',
        example: 100000,
        nullable: true,
    })
    public limit: number | null;

    @ApiProperty({
        description: 'Потрачено за текущий месяц (сумма всех операций)',
        example: 30000,
    })
    public spent: number;

    @ApiProperty({
        description: 'Остаток лимита',
        example: 70000,
        nullable: true,
    })
    public remaining: number | null;

    @ApiProperty({
        description: 'Код валюты кошелька',
        example: 'RUB',
    })
    public currencyCode: string;
}
