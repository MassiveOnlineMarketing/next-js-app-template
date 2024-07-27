
import { AxiosResponse } from "axios";

export interface IGoogleAdsApiRepository {
  generateHistoricalMetrics(country: string, language: string, keywordString: string[]): Promise<AxiosResponse<any, any> | null>;
}