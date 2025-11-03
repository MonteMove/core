import { ApiProperty } from '@nestjs/swagger';

import { NetworkResponseDto } from './network-response.dto';

export class UpdateNetworkResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Сеть успешно обновлена',
  })
  public message: string;

  @ApiProperty({
    description: 'Информация об обновлённой сети',
    type: NetworkResponseDto,
  })
  public network: NetworkResponseDto;
}
