import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class BlockUserResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Пользователь успешно заблокирован',
    })
    public message: string;

    @ApiProperty({
        description: 'Информация о пользователе',
        type: UserResponseDto,
    })
    public user: UserResponseDto;
}
