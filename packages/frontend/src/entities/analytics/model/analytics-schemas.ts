import { z } from "zod";

// TODO:Поменять схему на актуальную
export const AnalyticsItemResponseSchema = z.object({
  month: z.string(),
  desktop: z.number(),
  mobile: z.number(),
});

export type AnalyticsItemResponse = z.infer<typeof AnalyticsItemResponseSchema>;

export const AnalyticsResponseSchema = z.array(AnalyticsItemResponseSchema);

export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;
