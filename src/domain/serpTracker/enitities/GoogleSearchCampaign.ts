// src/domain/googleSearchConsole/entities/GoogleSearchProject.ts

import { CreateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";
import { utilityService } from "@/application/services/UtitlityService";
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from "@/presentation/components/google-search-campaign/form-options";


  /**
   * Creates a Google Search campaign.
   * 
   * @param id - The data for creating the campaign.
   * @returns A promise that resolves to the created GoogleSearchCampaign.
   * @throws {GoogleSearchError} If the user is unauthorized.
   */
export class GoogleSearchCampaign {
  id: string;
  userId: string;
  projectName: string;
  domainUrl: string;
  language: string;
  languageCode: string;
  country: string;
  location: string | null;
  locationCode: string
  gscUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  websiteId: string;

  constructor(
    id: string,
    userId: string,
    projectName: string,
    domainUrl: string,
    language: string,
    languageCode: string,
    country: string,
    location: string | null,
    locationCode: string,
    gscUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
    websiteId: string,
  ){
    this.id = id;
    this.userId = userId;
    this.projectName = projectName;
    this.domainUrl = domainUrl;
    this.language = language;
    this.languageCode = languageCode;
    this.country = country;
    this.location = location;
    this.locationCode = locationCode;
    this.gscUrl = gscUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.websiteId = websiteId;
  }

  // Business methods and behaviors, like validation or update logic


  static fromDto(campaignDto: CreateGoogleSearchCampaignDto): GoogleSearchCampaign {
    const UtilityService = new utilityService();
    console.log('Creating Google Search dto:', campaignDto);
    console.log(GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.find(option => option.value === campaignDto.language)?.criterionId);
    return new GoogleSearchCampaign(
      UtilityService.genereateUUID(),
      campaignDto.userId,
      campaignDto.projectName,
      campaignDto.domainUrl,
      campaignDto.language,
      GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.find(option => option.value === campaignDto.language)?.criterionId.toString() as string,
      campaignDto.country,
      campaignDto.location?.canonicalName || null,
      campaignDto.location?.googleId.toString() || GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find(option => option.value === campaignDto.country)?.criterionId.toString() as string, 
      campaignDto.gscSite,
      new Date(),
      new Date(),
      campaignDto.websiteId,
    );
  }
}