import axios from "axios";

import { GoogleSearchKeyword } from "@prisma/client";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { ISerperApiRepository } from "@/domain/serpTracker/api/ISerperApi";
import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";


export class SerperApiRepository implements ISerperApiRepository {
  /**
   * Fetches SERP (Search Engine Results Page) data from the Serper API.
   * @param campaign - The GoogleSearchCampaign object representing the campaign.
   * @param keywordBatch - An array of GoogleSearchKeyword objects representing the batch of keywords.
   * @param SERP_RESULT_LENGTH - The number of SERP results to fetch for each keyword. Default is 100.
   * @returns An array of SuccessfulSerpApiFetches objects representing the successful API fetches.
   */
  async fetchSerpData(
    campaign: GoogleSearchCampaign,
    keywordBatch: GoogleSearchKeyword[],
    SERP_RESULT_LENGTH: number = 100
  ) {
    const dataTYL = keywordBatch.map((keyword) => ({
      q: keyword.keyword,
      location: campaign.location ? campaign.location : undefined,
      gl: campaign.country,
      hl: campaign.language,
      autocorrect: false,
      num: SERP_RESULT_LENGTH,
    }));

    var successfulFetches: SuccessfulSerpApiFetches[] = [];

    let data = JSON.stringify(dataTYL);
    let config = {
      method: "post",
      url: "https://google.serper.dev/search",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios(config);
      if (response.data.length > 0) {
        response.data.forEach((item: any, i: number) => {
          item.searchParameters.keywordId = keywordBatch[i].id;
        });
        successfulFetches.push(...response.data);
      }

    } catch (error) {
      console.error("🔴 Error with the Serper API call:", error);
    }

    return successfulFetches;
  }

}

/**
 * Represents a repository for interacting with the Serper API.
 */
const serperApiRepository = new SerperApiRepository();
export default serperApiRepository;
