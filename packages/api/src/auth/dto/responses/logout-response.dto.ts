import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Выход из системы выполнен успешно',
    })
    public message: string;
}
