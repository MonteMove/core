import { ApiProperty } from '@nestjs/swagger';

export class OperationTypeResponseDto {
  @ApiProperty({
    description: 'ID типа операции',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public id: string;

  @ApiProperty({
    description: 'Название типа операции',
    example: 'Вывод средств',
  })
  public name: string;

  @ApiProperty({
    description: 'Описание типа операции',
    example: 'Операция по выводу средств на внешний кошелёк',
    nullable: true,
  })
  public description: string | null;

  @ApiProperty({
    description: 'ID пользователя, создавшего запись',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public userId: string;

  @ApiProperty({
    description: 'ID пользователя, обновившего запись',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  public updatedById: string;

  @ApiProperty({
    description: 'Дата создания записи',
    example: '2024-01-01T00:00:00.000Z',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления записи',
    example: '2024-01-02T00:00:00.000Z',
  })
  public updatedAt: Date;
}
