// src/application/dto/GoogleSearchCampaignDto.ts

export interface CreateGoogleSearchCampaignDto {
  userId: string
  domainUrl: string;
  websiteId: string;
  competitors: string[] | undefined;
  projectName: string;
  language: string;
  country: string;
  isMobile: boolean;
  specificDaysOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] | undefined;
  gscSite?: string | undefined;
  keywords?: string | undefined;
}


export interface UpdateGoogleSearchCampaignDto {
  userId: string
  competitors: string[] | undefined;
  projectName: string;
  language: string;
  country: string;
  isMobile: boolean;
  specificDaysOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] | undefined;
  gscSite?: string | undefined;
  keywords?: string | undefined;
}