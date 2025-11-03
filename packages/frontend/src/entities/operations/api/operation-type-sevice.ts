import {
  OperationType,
  OperationTypesResponseSchema,
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
}
