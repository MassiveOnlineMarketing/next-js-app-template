import { TKeyword } from "@/domain/serpTracker/enitities/Keyword";
import { ISerperApiRepository } from "@/domain/serpTracker/repository/ISerperApiRepository";
import { SerpResult, UserSerpResult } from "@/domain/models/serpResult";
import { IGoogleSearchSerpResultRepository } from "@/domain/serpTracker/repository/IGoogleSearchSerpResultRepository";
import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";


export class SerperApiService {
  private serperApiRepository: ISerperApiRepository;
  private googleSearchSerpResultRepository: IGoogleSearchSerpResultRepository;

  constructor(
    serperApiRepository: ISerperApiRepository,
    googleSearchSerpResultRepository: IGoogleSearchSerpResultRepository
  ) {
    this.serperApiRepository = serperApiRepository;
    this.googleSearchSerpResultRepository = googleSearchSerpResultRepository;
  }

  async handleGoogleSearchResults(keywords: TKeyword[], language: string, country: string, domainUrl: string, userId: string, projectId: string) {
    const serperApiResponse = await this.serperApiRepository.fetchResults(keywords, language, country, domainUrl, userId, projectId);
    if (!serperApiResponse) {
      throw new Error('Failed to fetch results');
    }

    // Insert top ten results the data into the database
    const topTenResultData = this.handleTopTenResults(serperApiResponse);
    this.googleSearchSerpResultRepository.insertSerpResults(topTenResultData);

    const userResultData = this.handleUserResults(serperApiResponse);
    const successfullUserInserts = await this.googleSearchSerpResultRepository.insertUserResults(userResultData);

    const keywordIds = userResultData.map(keyword => keyword.keywordId);

    return { userResultKeywordIds: keywordIds, successfullUserInserts };
  }

  handleTopTenResults(serperApiResponse: SuccessfulSerpApiFetches[]): SerpResult[] {
    const insertData = [];
    for (const results of serperApiResponse) {
      for (const result of results.organic.slice(0, 10)) {
        insertData.push({
          keywordId: result.keywordId,
          position: result.position,
          url: result.link,
          metaTitle: result.title,
          metaDescription: result.snippet,
        });
      }
    }

    return insertData;
  }

  handleUserResults(serperApiResponse: SuccessfulSerpApiFetches[]): UserSerpResult[] {
    const newResults: UserSerpResult[] = [];
    console.log("🟡 handle user results");

    for (const result of serperApiResponse) {
      const filteredResults = result.organic.filter((item) =>
        item.link.includes(item.domain),
      );
      // console.log('filteredResults', filteredResults);

      if (filteredResults.length === 0) {
        newResults.push({
          keywordId: result.organic[0].keywordId,
          resultTitle: undefined,
          resultURL: undefined,
          resultDescription: undefined,
          resultPosition: null,
          resultName: result.organic[0].keywordName,
          resultProjectdId: result.organic[0].projectId,
          peopleAlsoAsk: result.peopleAlsoAsk,
          relatedSearches: result.relatedSearches,
          userId: result.organic[0].userId,
        });
      } else {
        const item = filteredResults[0];
        newResults.push({
          keywordId: item.keywordId,
          resultTitle: item.title,
          resultURL: item.link.replace(`https://${item.domain}`, ""),
          resultDescription: item.snippet,
          resultPosition: item.position,
          resultName: item.keywordName,
          resultProjectdId: item.projectId,
          peopleAlsoAsk: result.peopleAlsoAsk,
          relatedSearches: result.relatedSearches,
          userId: item.userId,
        });
      }
    }

    return newResults;
  }
}