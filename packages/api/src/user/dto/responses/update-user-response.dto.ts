import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class UpdateUserResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Пользователь успешно обновлен' })
    public message: string;

    @ApiProperty({ description: 'Информация об обновленном пользователе', type: UserResponseDto })
    public user: UserResponseDto;
}
