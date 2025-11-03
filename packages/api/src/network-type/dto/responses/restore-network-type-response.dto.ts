import { ApiProperty } from '@nestjs/swagger';

export class RestoreNetworkTypeResponseDto {
  @ApiProperty({
    description: 'Сообщение об успешном восстановлении',
    example: 'Тип сети успешно восстановлен',
  })
  public message: string;
}
