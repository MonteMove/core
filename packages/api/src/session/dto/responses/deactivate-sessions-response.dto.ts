import { ApiProperty } from '@nestjs/swagger';

export class DeactivateSessionsResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Сессии пользователя успешно деактивированы',
  })
  public message: string;

  @ApiProperty({
    description: 'Количество деактивированных сессий',
    example: 3,
  })
  public deactivatedCount: number;
}
