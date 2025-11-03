import { OperationResponseDto } from '../dto';

export type OperationResponse = OperationResponseDto;

export interface CreateOperationResponse {
  message: string;
  operation: OperationResponse;
}

export interface UpdateOperationResponse {
  message: string;
  operation: OperationResponse;
}

export interface DeleteOperationResponse {
  message: string;
}

export interface GetOperationsResponse {
  operations: OperationResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdjustmentOperationResponse {
  message: string;
  operation: OperationResponse | null;
  previousAmount: number;
  newAmount: number;
  adjustmentAmount: number;
}
