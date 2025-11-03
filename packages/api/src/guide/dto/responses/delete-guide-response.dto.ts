import { ApiProperty } from '@nestjs/swagger';

export class DeleteGuideResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Гид успешно удален',
  })
  public message: string;
}
