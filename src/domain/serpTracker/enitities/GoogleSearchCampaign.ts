// src/domain/googleSearchConsole/entities/GoogleSearchProject.ts

import { CreateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";


// ! Note in use
export class GoogleSearchCampaign {
  id: string;
  userId: string;
  projectName: string;
  domainUrl: string;
  language: string;
  country: string;
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
    country: string,
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
    this.country = country;
    this.gscUrl = gscUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.websiteId = websiteId;
  }

  // Business methods and behaviors, like validation or update logic


  // static fromDto(campaignDto: CreateGoogleSearchCampaignDto): GoogleSearchCampaign {
  //   console.log('Creating Google Search dto:', campaignDto);
  //   return new GoogleSearchCampaign(
  //     '123',
  //     campaignDto.name,
  //     campaignDto.keywords,
  //   );
  // }
}