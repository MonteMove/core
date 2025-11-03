import { z } from 'zod';

import { PaginationSchema } from '@/shared/utils/schemas/common-schemas';

export const OperationTypeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  updatedById: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  created_by: z
    .object({
      id: z.string().uuid(),
      username: z.string(),
    })
    .optional(),
  updated_by: z
    .object({
      id: z.string().uuid(),
      username: z.string(),
    })
    .optional(),
});

export const GetOperationTypesParamsSchema = z.object({
  search: z.string().optional(),
  sortField: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const CreateOperationTypeSchema = z.object({
  name: z
    .string()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: z
    .string()
    .max(1000, 'Описание не должно превышать 1000 символов')
    .optional(),
});

export const OperationTypesResponseSchema = z.object({
  operationTypes: z.array(OperationTypeSchema),
  pagination: PaginationSchema,
});

export const OperationTypeInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const OperationInfoSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullable(),
});

export type OperationType = z.infer<typeof OperationTypeSchema>;
export type GetOperationTypesParams = z.infer<
  typeof GetOperationTypesParamsSchema
>;
export type CreateOperationTypeRequest = z.infer<
  typeof CreateOperationTypeSchema
>;
export type OperationTypesResponse = z.infer<
  typeof OperationTypesResponseSchema
>;
