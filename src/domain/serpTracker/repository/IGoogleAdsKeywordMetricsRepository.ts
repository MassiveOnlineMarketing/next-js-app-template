import { KeywordMetricsInput } from "@/domain/models/historicalMetrics";


export interface IGoogleAdsKeywordMetricsRepository {
  insertMetrics(data: KeywordMetricsInput[]): Promise<boolean>;
}