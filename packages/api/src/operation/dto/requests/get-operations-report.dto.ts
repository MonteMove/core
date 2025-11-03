import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { BaseReportDto } from './base-report.dto';

export enum OperationReportWalletFilter {
  all = 'all',
  wnzh = 'wnzh',
  inskesh = 'inskesh',
  notWnzhInskesh = 'not_wnsh_inskesh',
}

export class GetOperationsReportDto extends BaseReportDto {
  @ApiPropertyOptional({
    description:
      'Фильтр по типу кошелька: все, только ВНЖ, только Инскеш или исключая оба варианта',
    enum: OperationReportWalletFilter,
    default: OperationReportWalletFilter.all,
  })
  @IsOptional()
  @IsEnum(OperationReportWalletFilter)
  public typeUnloading?: OperationReportWalletFilter;
}
