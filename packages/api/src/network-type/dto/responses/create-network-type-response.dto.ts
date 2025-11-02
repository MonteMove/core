import { ApiProperty } from '@nestjs/swagger';

import { NetworkTypeResponseDto } from './network-type-response.dto';

export class CreateNetworkTypeResponseDto {
    @ApiProperty({ description: 'Сообщение о результате операции', example: 'Тип сети успешно создан' })
    public message: string;

    @ApiProperty({ description: 'Созданный тип сети', type: NetworkTypeResponseDto })
    public networkType: NetworkTypeResponseDto;
}
