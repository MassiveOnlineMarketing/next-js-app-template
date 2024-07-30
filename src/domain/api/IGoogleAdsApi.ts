
import { AxiosResponse } from "axios";

export interface IGoogleAdsApi {
  generateHistoricalMetrics(country: string, language: string, keywordString: string[]): Promise<AxiosResponse<any, any> | null>;
}