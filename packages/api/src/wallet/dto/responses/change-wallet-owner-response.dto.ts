import { ApiProperty } from '@nestjs/swagger';

import { WalletResponseDto } from './wallet-response.dto';

export class ChangeWalletOwnerResponseDto {
    @ApiProperty({
        description: 'Сообщение об успешной смене держателя',
        example: 'Держатель кошелька успешно изменен',
    })
    public message: string;

    @ApiProperty({
        description: 'Обновленный кошелек',
        type: WalletResponseDto,
    })
    public wallet: WalletResponseDto;
}
