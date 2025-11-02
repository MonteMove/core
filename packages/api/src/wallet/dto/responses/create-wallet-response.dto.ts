import { ApiProperty } from '@nestjs/swagger';

import { WalletResponseDto } from './wallet-response.dto';

export class CreateWalletResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Кошелек успешно создан' })
    public message: string;

    @ApiProperty({ description: 'Информация о созданном кошельке', type: WalletResponseDto })
    public wallet: WalletResponseDto;
}
