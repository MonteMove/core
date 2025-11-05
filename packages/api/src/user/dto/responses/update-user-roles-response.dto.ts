import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDto } from './user-response.dto';

export class UpdateUserRolesResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Роли пользователя успешно обновлены',
    })
    public message: string;

    @ApiProperty({
        description: 'Информация об обновлённом пользователе',
        type: UserResponseDto,
    })
    public user: UserResponseDto;
}
