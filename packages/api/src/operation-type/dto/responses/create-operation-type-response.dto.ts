import { ApiProperty } from '@nestjs/swagger';

import { OperationTypeResponseDto } from './operation-type-response.dto';

export class CreateOperationTypeResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Тип операции успешно создан',
  })
  public message: string;

  @ApiProperty({
    description: 'Созданный тип операции',
    type: OperationTypeResponseDto,
  })
  public operationType: OperationTypeResponseDto;
}
