import { z } from 'zod';

export const AnalyticsItemResponseSchema = z.object({
  month: z.string(),
  incoming: z.number(),
  outgoing: z.number(),
  transactions: z.number(),
});

export type AnalyticsItemResponse = z.infer<typeof AnalyticsItemResponseSchema>;

export const AnalyticsResponseSchema = z.array(AnalyticsItemResponseSchema);

export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;
