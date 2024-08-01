import { KeywordMetricsInput } from "@/domain/models/historicalMetrics";
import { TKeyword } from "@/domain/serpTracker/enitities/GoogleSearchKeyword";

import { IGoogleAdsApi } from "@/domain/api/IGoogleAdsApi";
import { IGoogleAdsKeywordMetricsRepository } from "@/domain/serpTracker/repository/IGoogleAdsKeywordMetricsRepository";

export class GoogleAdsApiService {
  private googleAdsApi: IGoogleAdsApi;
  private googleAdsKeywordMetricsRepository: IGoogleAdsKeywordMetricsRepository;

  constructor(
    googleAdsApi: IGoogleAdsApi, 
    googleAdsKeywordMetricsRepository: IGoogleAdsKeywordMetricsRepository
  ) {
    this.googleAdsApi = googleAdsApi;
    this.googleAdsKeywordMetricsRepository = googleAdsKeywordMetricsRepository;
  }

  async handleKeywordsForGoogleAdsApi(keywords: TKeyword[], country: string, language: string) {
    const keywordIdMap = keywords.reduce<{ [key: string]: string }>((map, keyword) => {
      map[keyword.keyword] = keyword.id;
      return map;
    }, {});
    // console.log('keywordIdMap', keywordIdMap);
    const keywordString = keywords.map(keyword => keyword.keyword);
  
    // Make the API call to get the metrics
    const keywordMetricsRes = await this.googleAdsApi.generateHistoricalMetrics(country, language, keywordString);
  
    if (!keywordMetricsRes) {
      return [];
    }


    // Map the response to include the keyword IDs
    const resultsWithIds = keywordMetricsRes.data.results.map((result: KeywordMetricsInput) => {
      return {
        ...result,
        id: keywordIdMap[result.text]
      };
    });


    this.googleAdsKeywordMetricsRepository.insertMetrics(resultsWithIds);

    return resultsWithIds;
  }
}