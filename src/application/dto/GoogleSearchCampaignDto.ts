// src/application/dto/GoogleSearchCampaignDto.ts
import { GoogleSearchLocation } from "@/domain/models/serperApi";
import { GoogleSearchCountry, GoogleSearchLanguage } from "@/presentation/components/google-search-campaign/form-options";

export interface CreateGoogleSearchCampaignDto {
  userId: string
  domainUrl: string;
  websiteId: string;
  campaignName: string;
  language: GoogleSearchLanguage;
  location: GoogleSearchLocation | null;
  country: GoogleSearchCountry;
  competitors: string[] | null;
  specificDaysOfWeek: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] ; 
  gscSite: string | null;
  keywords: string | null;
}


export interface UpdateGoogleSearchCampaignDto {
  userId: string
  campaignId: string;
  campaignName: string;
  language: GoogleSearchLanguage;
  location: GoogleSearchLocation | null;
  country: GoogleSearchCountry;
  competitors: string[] | null;
  specificDaysOfWeek: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[] ; 
  gscSite: string | null;
}