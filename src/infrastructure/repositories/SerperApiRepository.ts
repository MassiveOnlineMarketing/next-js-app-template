import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";
import { TKeyword } from "@/domain/serpTracker/enitities/Keyword";
import { ISerperApiRepository } from "@/domain/serpTracker/repository/ISerperApiRepository";
import axios from "axios";

export class SerperApiRepository implements ISerperApiRepository {
  async fetchResults(keywords: TKeyword[], language: string, country: string, domainUrl: string, userId: string, projectId: string): Promise<SuccessfulSerpApiFetches[]> {
    const dataTYL = keywords.map((keyword) => ({
      q: keyword.keyword,
      gl: country,
      hl: language,
      autocorrect: false,
      num: 100,
    }));
  
    // Error handling
    var successfulFetches = [];
    var failedFetches = [];
  
    let data = JSON.stringify(dataTYL);
  
    let config = {
      method: "post",
      url: "https://google.serper.dev/search",
      headers: {
        // soyojip238@seosnaps.com 196
  
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };
  
    try {
      const response = await axios(config);
      for (let i = 0; i < response.data.length; i++) {
        const result = response.data[i];
  
        let foramtedResult: SuccessfulSerpApiFetches = {
          organic: [],
          peopleAlsoAsk: [],
          relatedSearches: [],
        };
  
        if (result.organic.length > 0) {
          result.organic.forEach((item: any) => {
            item.keywordId = keywords[i].id;
            item.domain = domainUrl;
            item.keywordName = keywords[i].keyword;
            item.userId = userId;
            item.projectId = projectId;
          });
          foramtedResult.organic.push(...result.organic);
        } else {
          failedFetches.push(keywords[i]);
        }
        if (result.relatedSearches) {
          foramtedResult.relatedSearches?.push(...result.relatedSearches);
        }
  
        if (result.peopleAlsoAsk) {
          foramtedResult.peopleAlsoAsk?.push(...result.peopleAlsoAsk);
        }
  
        successfulFetches.push(foramtedResult);
      }
    } catch (error) {
      console.error("🔴 Error with the API call:", error);
    }
  
    if (failedFetches.length === 0) {
      console.log(
        `🟢 Successfully fetched all ${successfulFetches.length} keyword results from SERP API`,
      );
    } else {
      console.log(`🔴 Failed to fetch ${failedFetches.length} keyword results`);
    }
  
    return successfulFetches;
  }
}

const serperApiRepository = new SerperApiRepository();
export default serperApiRepository;