import { ApiProperty } from '@nestjs/swagger';

import { OperationTypeResponseDto } from './operation-type-response.dto';

export class UpdateOperationTypeResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Тип операции успешно обновлён',
  })
  public message: string;

  @ApiProperty({
    description: 'Обновлённый тип операции',
    type: OperationTypeResponseDto,
  })
  public operationType: OperationTypeResponseDto;
}
