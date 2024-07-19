import { KeywordMetricsInput } from "@/domain/models/historicalMetrics";
import { TKeyword } from "@/domain/serpTracker/enitities/Keyword";

import { IGoogleAdsApiRepository } from "@/domain/repository/IGoogleAdsApiRepository";
import { IGoogleAdsKeywordMetrics } from "@/domain/serpTracker/repository/IGoogleAdsKeywordMetrics";

export class GoogleAdsApiService {
  private googleAdsApiRepository: IGoogleAdsApiRepository;
  private googleAdsKeywordMetrics: IGoogleAdsKeywordMetrics;

  constructor(
    googleAdsApiRepository: IGoogleAdsApiRepository, 
    googleAdsKeywordMetrics: IGoogleAdsKeywordMetrics
  ) {
    this.googleAdsApiRepository = googleAdsApiRepository;
    this.googleAdsKeywordMetrics = googleAdsKeywordMetrics;
  }

  async handleKeywordsForGoogleAdsApi(keywords: TKeyword[], country: string, language: string) {
    const keywordIdMap = keywords.reduce<{ [key: string]: string }>((map, keyword) => {
      map[keyword.keyword] = keyword.id;
      return map;
    }, {});
    // console.log('keywordIdMap', keywordIdMap);
    const keywordString = keywords.map(keyword => keyword.keyword);
  
    // Make the API call to get the metrics
    const keywordMetricsRes = await this.googleAdsApiRepository.generateHistoricalMetrics(country, language, keywordString);
  
    if (!keywordMetricsRes) {
      return [];
    }


    // Map the response to include the keyword IDs
    const resultsWithIds = keywordMetricsRes.data.result.results.map((result: KeywordMetricsInput) => {
      return {
        ...result,
        id: keywordIdMap[result.text]
      };
    });

    this.googleAdsKeywordMetrics.insertMetrics(resultsWithIds);
  }
}