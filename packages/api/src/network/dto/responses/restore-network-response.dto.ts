import { ApiProperty } from '@nestjs/swagger';

export class RestoreNetworkResponseDto {
    @ApiProperty({
        description: 'Сообщение об успешном восстановлении',
        example: 'Сеть успешно восстановлена',
    })
    public message: string;
}
