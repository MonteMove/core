import { ApiProperty } from '@nestjs/swagger';

import { AuthUserResponseDto } from './login-response.dto';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате',
    example: 'Пользователь успешно зарегистрирован',
  })
  public message: string;

  @ApiProperty({
    description: 'Информация о созданном пользователе',
    type: AuthUserResponseDto,
  })
  public user: AuthUserResponseDto;
}
