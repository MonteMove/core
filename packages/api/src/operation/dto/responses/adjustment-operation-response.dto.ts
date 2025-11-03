import { ApiProperty } from '@nestjs/swagger';

import { OperationResponseDto } from './operation-response.dto';

export class AdjustmentOperationResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате корректировки',
    example: 'Корректировка выполнена: пополнение на 1000',
  })
  public message: string;

  @ApiProperty({
    description: 'Созданная корректировочная операция',
    type: OperationResponseDto,
    nullable: true,
  })
  public operation: OperationResponseDto | null;

  @ApiProperty({
    description: 'Баланс кошелька до корректировки',
    example: 4000,
  })
  public previousAmount: number;

  @ApiProperty({
    description: 'Баланс кошелька после корректировки',
    example: 5000,
  })
  public newAmount: number;

  @ApiProperty({ description: 'Величина корректировки', example: 1000 })
  public adjustmentAmount: number;
}
