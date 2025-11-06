import {
  CreateOperationTypeRequest,
  CreateOperationTypeResponse,
  CreateOperationTypeResponseSchema,
  DeleteOperationTypeResponse,
  DeleteOperationTypeResponseSchema,
  OperationType,
  OperationTypesResponseSchema,
  UpdateOperationTypeRequest,
  UpdateOperationTypeResponse,
  UpdateOperationTypeResponseSchema,
} from '@/entities/operations/model/operation-type-schemas';
import { axiosInstance } from '@/shared/api/axios-instance';
import { API_MAP } from '@/shared/utils/constants/api-map';

export class OperationTypeService {
  public static async getOperationTypes(): Promise<OperationType[]> {
    const response = await axiosInstance.get(
      API_MAP.OPERATION_TYPES.OPERATION_TYPES,
    );
    return OperationTypesResponseSchema.parse(response.data).operationTypes;
  }

  public static async getOperationTypeById(id: string): Promise<OperationType> {
    const response = await axiosInstance.get(
      API_MAP.OPERATION_TYPES.OPERATION_TYPE_BY_ID(id),
    );
    return response.data;
  }

  public static async createOperationType(
    data: CreateOperationTypeRequest,
  ): Promise<CreateOperationTypeResponse> {
    const response = await axiosInstance.post(
      API_MAP.OPERATION_TYPES.OPERATION_TYPES,
      data,
    );
    return CreateOperationTypeResponseSchema.parse(response.data);
  }

  public static async updateOperationType(
    id: string,
    data: UpdateOperationTypeRequest,
  ): Promise<UpdateOperationTypeResponse> {
    const response = await axiosInstance.put(
      API_MAP.OPERATION_TYPES.OPERATION_TYPE_BY_ID(id),
      data,
    );
    return UpdateOperationTypeResponseSchema.parse(response.data);
  }

  public static async deleteOperationType(
    id: string,
  ): Promise<DeleteOperationTypeResponse> {
    const response = await axiosInstance.delete(
      API_MAP.OPERATION_TYPES.OPERATION_TYPE_BY_ID(id),
    );
    return DeleteOperationTypeResponseSchema.parse(response.data);
  }
}
