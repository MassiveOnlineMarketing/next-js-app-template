import { SerpApiPeopleAsloAsk, SerpApiRelatedSearches } from "@/domain/models/serperApi";
import { GoogleSearchKeywordTag } from "@/domain/serpTracker/models/GoogleSearchKeywordTag";
import { GetLatestResultsByCampaignIdReturnType, GetLatestResultsReturnType } from "../repository/IGoogleSearchSerpResultRepository";
import { KeywordMetric } from "@/domain/models/historicalMetrics";
import { GoogleSearchApiUserResult } from "./GoogleSearchApiUserResult";

/**
 * Represents the latest keyword result from a Google search.
 */
export class GoogleSearchLatestKeywordResult {
  id: string;
  keywordId: string;
  keywordName: string;
  position: number | null;
  url: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  firstPosition: number | null;
  bestPosition: number | null;
  latestChange: number | null;
  relatedSearches: SerpApiRelatedSearches[];
  peopleAlsoAsk: SerpApiPeopleAsloAsk[];
  tags: GoogleSearchKeywordTag[] | [];

  avgMonthlySearches: string | null;
  competition: string | null;
  competitionIndex: string | null;
  highTopOfBidPage: string | null;
  lowTopOfBidPage: string | null;

  createdAt: Date;

  constructor(
    id: string,
    keywordId: string,
    keywordName: string,
    position: number | null,
    url: string | null,
    metaTitle: string | null,
    metaDescription: string | null,
    firstPosition: number | null,
    bestPosition: number | null,
    latestChange: number | null,
    relatedSearches: SerpApiRelatedSearches[],
    peopleAlsoAsk: SerpApiPeopleAsloAsk[],
    tags: GoogleSearchKeywordTag[] | [],

    avgMonthlySearches: string | null,
    competition: string | null,
    competitionIndex: string | null,
    highTopOfBidPage: string | null,
    lowTopOfBidPage: string | null,

    createdAt: Date,
  ) {
    this.id = id;
    this.keywordId = keywordId;
    this.keywordName = keywordName;
    this.position = position;
    this.url = url;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.firstPosition = firstPosition;
    this.bestPosition = bestPosition;
    this.latestChange = latestChange;
    this.relatedSearches = relatedSearches;
    this.peopleAlsoAsk = peopleAlsoAsk;
    this.tags = tags;

    this.avgMonthlySearches = avgMonthlySearches;
    this.competition = competition;
    this.competitionIndex = competitionIndex;
    this.highTopOfBidPage = highTopOfBidPage;
    this.lowTopOfBidPage = lowTopOfBidPage;

    this.createdAt = createdAt;
  }


  /**
   * Converts data from a database query to an array of GoogleSearchLatestKeywordResult objects.
   * @param data - The data retrieved from the database query.
   * @returns An array of GoogleSearchLatestKeywordResult objects.
   */
  static fromDbQuery(data: GetLatestResultsReturnType) {
    const GoogleSearchLatestResultDto = data.map((result) => {
      const latestKeywordResult = new GoogleSearchLatestKeywordResult(
        result.id,
        result.keywordId,
        result.keywordName,

        result.position,
        result.url,
        result.metaTitle,
        result.metaDescription,
        result.firstPosition,
        result.bestPosition,
        result.latestChange,

        //@ts-ignore
        result.relatedSearches,
        result.peopleAlsoAsk,

        result.keyword.tags,

        result.keyword.keywordMetrics[0].avgMonthlySearches,
        result.keyword.keywordMetrics[0].competition,
        result.keyword.keywordMetrics[0].competitionIndex,
        result.keyword.keywordMetrics[0].highTopOfPageBid,
        result.keyword.keywordMetrics[0].lowTopOfPageBid,

        result.createdAt,
      )

      return { ...latestKeywordResult }
    });
    return GoogleSearchLatestResultDto;
  }

  // Def in use
  static fromDbQueryByCampaignId(data: GetLatestResultsByCampaignIdReturnType) {
    const GoogleSearchLatestResultDto = data?.keyword.map((serpResult) => {
      if (!serpResult) {
        return null;
      }
      // console.log('serpResult:', serpResult);
      const latestKeywordResult = new GoogleSearchLatestKeywordResult(
        serpResult.result[0].id,
        serpResult.result[0].keywordId,
        serpResult.result[0].keywordName,

        serpResult.result[0].position,
        serpResult.result[0].url,
        serpResult.result[0].metaTitle,
        serpResult.result[0].metaDescription,
        serpResult.result[0].firstPosition,
        serpResult.result[0].bestPosition,
        serpResult.result[0].latestChange,

        // @ts-ignore
        serpResult.result[0].relatedSearches,
        serpResult.result[0].peopleAlsoAsk,

        serpResult.tags,

        serpResult.keywordMetrics[0]?.avgMonthlySearches || null,
        serpResult.keywordMetrics[0]?.competition || null,
        serpResult.keywordMetrics[0]?.competitionIndex || null,
        serpResult.keywordMetrics[0]?.highTopOfPageBid || null,
        serpResult.keywordMetrics[0]?.lowTopOfPageBid || null,

        serpResult.createdAt,
      )

      return { ...latestKeywordResult }
    });
    return GoogleSearchLatestResultDto;
  }

  static combineUserResultsWithKeywordMetrics(userResults: GoogleSearchApiUserResult[], keywordMetrics: KeywordMetric[]) {
    const latestUserResultWithKeywordMetrics = userResults.map((item: GoogleSearchApiUserResult) => {
      const keywordMetric = keywordMetrics.find((metric: KeywordMetric) => metric.id === item.keywordId);
      const latestResult = new GoogleSearchLatestKeywordResult(
        item.id,
        item.keywordId,
        item.keywordName,

        item.position,
        item.url,
        item.metaTitle,
        item.metaDescription,
        item.firstPosition,
        item.bestPosition,
        item.latestChange,

        // @ts-ignore
        item.relatedSearches,
        item.peopleAlsoAsk,
        [],
        keywordMetric?.keyword_metrics.avg_monthly_searches || null,
        keywordMetric?.keyword_metrics.competition || null,
        keywordMetric?.keyword_metrics.competition_index || null,
        keywordMetric?.keyword_metrics.high_top_of_page_bid_micros || null,
        keywordMetric?.keyword_metrics.low_top_of_page_bid_micros || null,
        item.createdAt,
      );
      return { ...latestResult }
    });

    return latestUserResultWithKeywordMetrics;
  }
}