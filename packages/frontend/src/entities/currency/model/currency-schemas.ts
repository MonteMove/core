import { z } from "zod";

export const CurrencySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  updatedById: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCurrencySchema = z.object({
  code: z.string().min(1, "Код валюты обязателен"),
  name: z.string().min(1, "Название валюты обязательно"),
  symbol: z.string().min(1, "Символ валюты обязателен"),
});

export const GetCurrenciesParamsSchema = z.object({
  search: z.string().optional(),
  code: z.string().optional(),
  sortField: z.enum(["code", "name", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const GetCurrenciesResponseSchema = z.object({
  currencies: z.array(CurrencySchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export const CurrencyInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
});

export type Currency = z.infer<typeof CurrencySchema>;
export type CreateCurrencyRequest = z.infer<typeof CreateCurrencySchema>;
export type GetCurrenciesParams = z.infer<typeof GetCurrenciesParamsSchema>;
export type CurrenciesResponse = z.infer<typeof GetCurrenciesResponseSchema>;
