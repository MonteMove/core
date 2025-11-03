import { ApiProperty } from '@nestjs/swagger';

import { NetworkResponseDto } from './network-response.dto';

export class CreateNetworkResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Сеть успешно создана',
  })
  public message: string;

  @ApiProperty({
    description: 'Информация о созданной сети',
    type: NetworkResponseDto,
  })
  public network: NetworkResponseDto;
}
