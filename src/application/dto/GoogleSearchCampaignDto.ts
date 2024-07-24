// src/application/dto/GoogleSearchCampaignDto.ts
import { GoogleSearchLocation } from "@/domain/models/serperApi";

export interface CreateGoogleSearchCampaignDto {
  userId: string
  domainUrl: string;
  websiteId: string;
  competitors: string[] | null;
  location: GoogleSearchLocation | null;
  projectName: string;
  language: string;
  country: string;
  specificDaysOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
  gscSite: string | null;
  keywords: string | null;
}


export interface UpdateGoogleSearchCampaignDto {
  userId: string
  competitors: string[] | undefined;
  projectName: string;
  language: string;
  country: string;
  specificDaysOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[];
  gscSite?: string | undefined;
  keywords?: string | undefined;
}