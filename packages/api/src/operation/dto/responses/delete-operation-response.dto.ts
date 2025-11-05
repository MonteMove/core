import { ApiProperty } from '@nestjs/swagger';

export class DeleteOperationResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Операция успешно удалена',
    })
    public message: string;
}
