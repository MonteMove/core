import { ApiProperty } from '@nestjs/swagger';

export class DeleteApplicationResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Заявка успешно удалена',
    })
    public message: string;
}
