import { ApiProperty } from '@nestjs/swagger';

export class DeleteWalletResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Кошелек успешно удален',
    })
    public message: string;
}
