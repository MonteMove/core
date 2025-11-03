import { z } from 'zod';

export const ReportsGeneralSchema = z.object({
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  operationTypeId: z.string().uuid(),
  typeUnloading: z.enum(['all', 'wnzh', 'inskesh', 'not_wnzh_inskesh']),
});

export const ReportsConversionSchema = z.object({
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  operationTypeId: z.string().uuid(),
});

export const ReportsPeriodSchema = z.object({
  walletType: z.enum(['inskech', 'bet11', 'vnj']),
});

export type ReportsGeneral = z.infer<typeof ReportsGeneralSchema>;
export type ReportsConversion = z.infer<typeof ReportsConversionSchema>;
export type ReportsPeriod = z.infer<typeof ReportsPeriodSchema>;
