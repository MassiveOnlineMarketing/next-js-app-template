import { CreateGoogleSearchCampaignDto, UpdateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";
import { utilityService } from "@/application/services/UtitlityService";
import { DayOfWeek, GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from "@/presentation/components/google-search-campaign/form-options";



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
  campaignName: string;
  domainUrl: string;
  language: string;
  languageCode: string;
  country: string;
  location: string | null;
  locationCode: string
  gscUrl: string | null;
  refreshDays: DayOfWeek[];
  createdAt: Date;
  updatedAt: Date;
  websiteId: string;

  constructor(
    id: string,
    userId: string,
    campaignName: string,
    domainUrl: string,
    language: string,
    languageCode: string,
    country: string,
    location: string | null,
    locationCode: string,
    gscUrl: string | null,
    refreshDays: DayOfWeek[],
    createdAt: Date,
    updatedAt: Date,
    websiteId: string,
  ){
    this.id = id;
    this.userId = userId;
    this.campaignName = campaignName;
    this.domainUrl = domainUrl;
    this.language = language;
    this.languageCode = languageCode;
    this.country = country;
    this.location = location;
    this.locationCode = locationCode;
    this.gscUrl = gscUrl;
    this.refreshDays = refreshDays;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.websiteId = websiteId;
  }


  /**
   * Creates a new instance of GoogleSearchCampaign from a DTO object.
   * @param campaignDto - The DTO object containing the campaign data.
   * @returns A new instance of GoogleSearchCampaign.
   */
  static fromDto(campaignDto: CreateGoogleSearchCampaignDto): GoogleSearchCampaign {
    const UtilityService = new utilityService();

    return new GoogleSearchCampaign(
      UtilityService.genereateUUID(),
      campaignDto.userId,
      campaignDto.campaignName,
      campaignDto.domainUrl,
      campaignDto.language.countryCode,
      GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.find(option => option.countryCode === campaignDto.language.countryCode)?.googleId.toString() as string,
      campaignDto.country.countryCode,
      campaignDto.location?.canonicalName || null,
      campaignDto.location?.googleId.toString() || GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find(option => option.countryCode === campaignDto.country.countryCode)?.googleId.toString() as string, 
      campaignDto.gscSite,
      campaignDto.specificDaysOfWeek ?? [],
      new Date(),
      new Date(),
      campaignDto.websiteId,
    );
  }

  /**
   * Creates a new instance of `GoogleSearchCampaign` by updating an existing campaign with the provided DTO.
   * @param campaignDto - The DTO containing the updated campaign data.
   * @param existingCampaign - The existing campaign to be updated.
   * @returns A new instance of `GoogleSearchCampaign` with the updated data.
   */
  static fromUpdateDto(campaignDto: UpdateGoogleSearchCampaignDto, existingCampaign: GoogleSearchCampaign): GoogleSearchCampaign {
    return new GoogleSearchCampaign(
      existingCampaign.id,
      campaignDto.userId,
      campaignDto.campaignName,
      existingCampaign.domainUrl,
      campaignDto.language.countryCode,
      GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.find(option => option.countryCode === campaignDto.language.countryCode)?.googleId.toString() as string,
      campaignDto.country.countryCode,
      campaignDto.location?.canonicalName || null,
      campaignDto.location?.googleId.toString() || GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find(option => option.countryCode === campaignDto.country.countryCode)?.googleId.toString() as string, 
      existingCampaign.gscUrl,
      campaignDto.specificDaysOfWeek ?? [],
      existingCampaign.createdAt,
      new Date(),
      existingCampaign.websiteId,
    );
  }
}