import { ApiProperty } from '@nestjs/swagger';

import { NetworkTypeResponseDto } from './network-type-response.dto';

export class UpdateNetworkTypeResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Тип сети успешно обновлён',
    })
    public message: string;

    @ApiProperty({
        description: 'Обновлённый тип сети',
        type: NetworkTypeResponseDto,
    })
    public networkType: NetworkTypeResponseDto;
}
