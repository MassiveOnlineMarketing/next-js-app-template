import { SerpApiPeopleAsloAsk, SerpApiRelatedSearches } from "@/domain/models/serperApi";
import { GoogleSearchKeywordTag } from "@/domain/serpTracker/models/GoogleSearchKeywordTag";
import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";
import { Prisma } from "@prisma/client";

type GetLatestResultsType = Prisma.PromiseReturnType<typeof googleSearchSerpResultRepository.getLatestResults>;
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
  tags: GoogleSearchKeywordTag[];

  // avgMonthlySearches: string | null;
  // competition: string | null;
  // competitionIndex: string | null;
  // highTopOfBidPage: string | null;
  // lowTopOfBidPage: string | null;

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
    tags: GoogleSearchKeywordTag[],
    
    // avgMonthlySearches: string | null,
    // competition: string | null,
    // competitionIndex: string | null,
    // highTopOfBidPage: string | null,
    // lowTopOfBidPage: string | null,
    
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

    // this.avgMonthlySearches = avgMonthlySearches;
    // this.competition = competition;
    // this.competitionIndex = competitionIndex;
    // this.highTopOfBidPage = highTopOfBidPage;
    // this.lowTopOfBidPage = lowTopOfBidPage;

    this.createdAt = createdAt;
  }

  
  /**
   * Converts data from a database query to an array of GoogleSearchLatestKeywordResult objects.
   * @param data - The data retrieved from the database query.
   * @returns An array of GoogleSearchLatestKeywordResult objects.
   */
  static fromDbQuery(data: GetLatestResultsType) {
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

        // result.keyword.keywordMetrics[0].avgMonthlySearches,
        // result.keyword.keywordMetrics[0].competition,
        // result.keyword.keywordMetrics[0].competitionIndex,
        // result.keyword.keywordMetrics[0].highTopOfPageBid,
        // result.keyword.keywordMetrics[0].lowTopOfPageBid,
        
        result.createdAt,
      )

      return { ...latestKeywordResult }
    })
    

    return GoogleSearchLatestResultDto;
  }
}