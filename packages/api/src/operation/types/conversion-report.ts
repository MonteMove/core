import { OperationWithDetails } from './report-data';

export interface ConversionGroup {
  conversionGroupId: number;
  operations: OperationWithDetails[];
}

export interface ConversionWalletEntry {
  name: string;
  amount: number;
  currency: string;
}
