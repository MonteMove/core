import { ApiProperty } from '@nestjs/swagger';

export class DeleteOperationTypeResponseDto {
    @ApiProperty({ description: 'Сообщение о результате операции', example: 'Тип операции успешно удалён' })
    public message: string;
}
