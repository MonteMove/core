import { ApiProperty } from '@nestjs/swagger';

import { WalletResponseDto } from './wallet-response.dto';

export class UpdateWalletResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Кошелек успешно обновлен' })
    public message: string;

    @ApiProperty({ description: 'Информация об обновленном кошельке', type: WalletResponseDto })
    public wallet: WalletResponseDto;
}
