import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class BaseReportDto {
  @ApiPropertyOptional({
    description: 'Начальная дата выборки (включительно)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dateStart?: Date;

  @ApiPropertyOptional({
    description: 'Конечная дата выборки (включительно)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dateEnd?: Date;

  @ApiPropertyOptional({
    description: 'Фильтрация по типу операции',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  public operationTypeId?: string;
}
