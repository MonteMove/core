import { ApiProperty } from '@nestjs/swagger';

export class DeleteNetworkTypeResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Тип сети успешно удалён',
  })
  public message: string;
}
