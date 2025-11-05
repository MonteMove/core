import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Пользователь успешно удален',
    })
    public message: string;
}
