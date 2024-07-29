import { SimpleError } from "@/domain/errors/simpleErrors";
import { Keyword } from "@/domain/serpTracker/enitities/Keyword";

import { AuthService } from "./AuthService";
import { SerperApiService } from "./SerperApiService";
import { GoogleSearchCampaignService } from "./GoogleSearchCampaignService";

import keywordRepository from "@/infrastructure/repositories/KeywordRepository";
import serperApiRepository from "@/infrastructure/api/SerperApi";

type Data = {
  campaignId: string;
  keywordNames: string[];
};



export class SerpApiService {
  private authService: AuthService;
  private googleSearchCampaignService: GoogleSearchCampaignService;
  private serperApiService: SerperApiService;

  constructor(
    authService: AuthService,
    googleSearchCampaignService: GoogleSearchCampaignService,
    serperApiService: SerperApiService
  ) {
    this.authService = authService;
    this.googleSearchCampaignService = googleSearchCampaignService;
    this.serperApiService = serperApiService;
  }

  async handleApiRequest(data: Data): Promise<any> {
    const user = await this.authService.currentUser();
    if (!user?.id || !user) {
      return new SimpleError(401, "Unauthorized");
    }

    const { campaignId, keywordNames} = data;
    
    const googleSearchCampaignData = await this.googleSearchCampaignService.getById(campaignId);
    if (!googleSearchCampaignData) {
      return new SimpleError(404, "Campaign not found");
    }
    const userHasEnoughCredits = this.googleSearchCampaignService.userHasEnoughCredits(user, keywordNames.length);

    if (!userHasEnoughCredits) {
      return new SimpleError(403, "User does not have enough credits");
    }

    const competitors = await this.googleSearchCampaignService.getCompetitorsByCampaignId(campaignId);

    // handle keywords
    const keywords = Keyword.generateAndFormatKeywords(campaignId, keywordNames);
    const res = await keywordRepository.createBulk(keywords);
    if (!res) {
      throw new SimpleError(500, "Failed to create keywords");
    }

    // fetch serp results from serper api
    const serperApiResults = await serperApiRepository.fetchSerpData(googleSearchCampaignData, keywords)


    this.serperApiService.handleCompetitorResults(serperApiResults, competitors)

    this.serperApiService.handleTopTenResults(serperApiResults)

    const userResult = await this.serperApiService.handleUserResults(serperApiResults, googleSearchCampaignData.domainUrl)

    this.googleSearchCampaignService.decrementCredits(user.id, userResult.length)

    return userResult 
  }
}
