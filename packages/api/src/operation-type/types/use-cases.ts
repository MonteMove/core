import { OperationTypeResponseDto } from '../dto';

export type OperationTypeResponse = OperationTypeResponseDto;

export interface CreateOperationTypeResponse {
    message: string;
    operationType: OperationTypeResponse;
}

export interface GetOperationTypeByIdResponse {
    operationType: OperationTypeResponse;
}

export interface GetOperationTypesResponse {
    operationTypes: OperationTypeResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateOperationTypeResponse {
    message: string;
    operationType: OperationTypeResponse;
}

export interface DeleteOperationTypeResponse {
    message: string;
}
