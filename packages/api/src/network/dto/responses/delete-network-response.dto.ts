import { ApiProperty } from '@nestjs/swagger';

export class DeleteNetworkResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Сеть успешно удалена',
    })
    public message: string;
}
