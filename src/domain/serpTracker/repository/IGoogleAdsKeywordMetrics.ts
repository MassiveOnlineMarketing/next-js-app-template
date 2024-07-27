import { KeywordMetricsInput } from "@/domain/models/historicalMetrics";


export interface IGoogleAdsKeywordMetrics {
  insertMetrics(data: KeywordMetricsInput[]): Promise<boolean>;
}