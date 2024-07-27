import { TKeyword } from "@/domain/serpTracker/enitities/Keyword";
import { ISerperApiRepository } from "@/domain/serpTracker/repository/ISerperApiRepository";

import { IGoogleSearchSerpResultRepository } from "@/domain/serpTracker/repository/IGoogleSearchSerpResultRepository";
import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";
import { SerperApiUserResult } from "@/domain/serpTracker/enitities/SerperApiUserResult";
import { SerperApiResult } from "@/domain/serpTracker/enitities/SerperApiResult";


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

    // const userResultData = this.handleUserResults(serperApiResponse);
    const userResultData = this.handleUserResults(serperApiResponse);
    const successfullUserInserts = await this.googleSearchSerpResultRepository.insertUserResults(userResultData);

    const keywordIds = userResultData.map(keyword => keyword.keywordId);

    return { userResultKeywordIds: keywordIds, successfullUserInserts };
  }

  handleTopTenResults(serperApiResponse: SuccessfulSerpApiFetches[]): SerperApiResult[] {
    const insertData = [];
    for (const results of serperApiResponse) {
      for (const result of results.organic.slice(0, 10)) {
        insertData.push(new SerperApiResult(result));
      }
    }

    return insertData;
  }

  handleUserResults(serperApiResponse: SuccessfulSerpApiFetches[]): SerperApiUserResult[] {
    const newResults: SerperApiUserResult[] = [];
    console.log("🟡 handle user results");
  
    for (const result of serperApiResponse) {
      const filteredResults = result.organic.filter(item => {
        // Normalize the item.link and item.domain for comparison
        const link = new URL(item.link).hostname.replace('www.', '');
        const domain = new URL(item.domain).hostname.replace('www.', '');
      
        // Check if the normalized link includes the normalized domain
        return link.includes(domain);
      });

      // console.log('filteredResults', filteredResults);
  
      if (filteredResults.length === 0) {
        const item = result.organic[0];
        newResults.push(new SerperApiUserResult(item, result, false));
      } else {
        const item = filteredResults[0];
        newResults.push(new SerperApiUserResult(item, result, true));
      }
    }
  
    return newResults;
  }
}