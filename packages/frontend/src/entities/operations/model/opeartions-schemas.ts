import z from "zod";

import {
  ReportsConversionSchema,
  ReportsGeneralSchema,
  ReportsPeriodSchema,
} from "@/entities/reports";
import { PaginationSchema } from "@/shared/utils/schemas/common-schemas";

export const OperationSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullable(),
});

export const OperationEntryDtoSchema = z.object({
  id: z.string().uuid(),
  wallet: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  direction: z.enum(["credit", "debit"]),
  before: z.number().nullable(),
  amount: z.number().min(1),
  after: z.number().nullable(),
  userId: z.string().uuid(),
  updatedById: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OperationEntryCreateDtoSchema = z.object({
  wallet: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  direction: z.enum(["credit", "debit"]),
  amount: z.number(),
});

export const CreateOperationDtoSchema = z.object({
  typeId: z.string().uuid(),
  applicationId: z.number(),
  description: z.string().max(2000).optional().nullable(),
  entries: z.array(OperationEntryCreateDtoSchema),
  creatureDate: z.string(),
});

export const OperationEntryUpdateDtoSchema = z.object({
  id: z.string().uuid(),
  wallet: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }),
  direction: z.enum(["credit", "debit"]),
  before: z.number().nullable(),
  amount: z.number(),
  after: z.number().nullable(),
  userId: z.string().uuid(),
  updatedById: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UpdateOperationDtoSchema = z.object({
  typeId: z.string().uuid(),
  applicationId: z.number(),
  description: z.string().max(2000, "Максимум 2000 символов").optional().nullable(),
  entries: z.array(OperationEntryDtoSchema),
  creatureDate: z.string(),
});

export const OperationResponseDtoSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  updateById: z.string().uuid(),
  typeId: z.string().uuid(),
  description: z.string().max(2000, "Максиммум 2000 символов").optional().nullable(),
  conversionGroupId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  entries: z.array(OperationEntryDtoSchema),
  type: z.object({ id: z.string().uuid(), name: z.string() }),
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

export const GetOperationsResponseDtoSchema = z.object({
  operations: z.array(OperationResponseDtoSchema),
  pagination: PaginationSchema,
});

export const GetOperationsParamsSchema = z.object({
  search: z.string().optional(),
  typeId: z.string().uuid().nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
});

export type OperationResponseDto = z.infer<typeof OperationResponseDtoSchema>;
export type UpdateOperationDto = z.infer<typeof UpdateOperationDtoSchema>;
export type GetOperationsResponseDto = z.infer<typeof GetOperationsResponseDtoSchema>;
export type GetOperationsParams = z.infer<typeof GetOperationsParamsSchema>;
export type ReportsGeneral = z.infer<typeof ReportsGeneralSchema>;
export type ReportsConversion = z.infer<typeof ReportsConversionSchema>;
export type ReportsPeriod = z.infer<typeof ReportsPeriodSchema>;
export type OperationEntryDto = z.infer<typeof OperationEntryDtoSchema>;
export type CreateOperationDto = z.infer<typeof CreateOperationDtoSchema>;
export type OperationEntryCreateDto = z.infer<typeof OperationEntryCreateDtoSchema>;
