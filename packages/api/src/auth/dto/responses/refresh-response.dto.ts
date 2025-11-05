import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
    @ApiProperty({
        description: 'Новый JWT токен доступа',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    public accessToken: string;

    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Токены успешно обновлены',
    })
    public message: string;
}
