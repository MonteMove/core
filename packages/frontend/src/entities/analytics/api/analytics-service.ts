import {
  AnalyticsItemResponse,
  AnalyticsItemResponseSchema,
  AnalyticsResponse,
  AnalyticsResponseSchema,
} from '@/entities/analytics/model/analytics-schemas';
import { axiosInstance } from '@/shared/api/axios-instance';
import { API_MAP } from '@/shared/utils/constants/api-map';

export class AnalyticsService {
  public static async getAnalytics(): Promise<AnalyticsResponse> {
    const response = await axiosInstance.get(API_MAP.ANALYTICS.ANALYTICS);
    return AnalyticsResponseSchema.parse(response.data);
  }

  public static async getAnalyticsById(
    id: string,
  ): Promise<AnalyticsItemResponse> {
    const response = await axiosInstance.get(
      API_MAP.ANALYTICS.ANALYTICS_BY_ID(id),
    );
    return AnalyticsItemResponseSchema.parse(response.data);
  }
}
