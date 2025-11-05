import { ApiProperty } from '@nestjs/swagger';

import { OperationResponseDto } from './operation-response.dto';

export class CreateOperationResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате операции',
        example: 'Операция успешно создана',
    })
    public message: string;

    @ApiProperty({
        description: 'Созданная операция',
        type: OperationResponseDto,
    })
    public operation: OperationResponseDto;
}
