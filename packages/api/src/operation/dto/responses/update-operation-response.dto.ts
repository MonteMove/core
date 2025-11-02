import { ApiProperty } from '@nestjs/swagger';

import { OperationResponseDto } from './operation-response.dto';

export class UpdateOperationResponseDto {
    @ApiProperty({ description: 'Сообщение о результате операции', example: 'Операция успешно обновлена' })
    public message: string;

    @ApiProperty({ description: 'Обновлённая операция', type: OperationResponseDto })
    public operation: OperationResponseDto;
}
