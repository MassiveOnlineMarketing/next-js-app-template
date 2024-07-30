import { KeywordMetricsInput } from "@/domain/models/historicalMetrics";
import { IGoogleAdsKeywordMetricsRepository } from "@/domain/serpTracker/repository/IGoogleAdsKeywordMetricsRepository";
import { db } from "../db/prisma";
import { GoogleAdsKeywordMetrics } from "@prisma/client";

class GoogleAdsKeywordMetricsRepository implements  IGoogleAdsKeywordMetricsRepository {
  async insertMetrics(data: KeywordMetricsInput[]): Promise<boolean> {
    const keywordMetrics = data.map((item) => ({
      googleSearchKeywordId: item.id,
      avgMonthlySearches: item.keyword_metrics.avg_monthly_searches,
      competition: item.keyword_metrics.competition,
      competitionIndex: item.keyword_metrics.competition_index,
      highTopOfPageBid: item.keyword_metrics.high_top_of_page_bid_micros,
      lowTopOfPageBid: item.keyword_metrics.low_top_of_page_bid_micros
    }));

    const res = await db.googleAdsKeywordMetrics.createMany({
      data: keywordMetrics
    }); 

    return !!res;
  }
}

const googleAdsKeywordMetricsRepository = new GoogleAdsKeywordMetricsRepository();
export default googleAdsKeywordMetricsRepository;