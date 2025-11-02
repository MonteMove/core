import { ApiProperty } from '@nestjs/swagger';

export class DeactivateMySessionByIdResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Сессия пользователя успешно деактивирована' })
    public message: string;
}
