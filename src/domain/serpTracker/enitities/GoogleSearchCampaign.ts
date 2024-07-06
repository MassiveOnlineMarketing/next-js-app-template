// src/domain/googleSearchConsole/entities/GoogleSearchProject.ts

import { CreateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";


export class GoogleSearchCampaign {
  id: string;
  name: string;
  keywords: string[];
  description?: string;

  constructor(id: string, name: string, keywords: string[]) {
    this.id = id;
    this.name = name;
    this.keywords = keywords;
    // Initialize other properties and validate as necessary
  }

  // Business methods and behaviors, like validation or update logic
  update(newDetails: Partial<GoogleSearchCampaign>) {
    if (newDetails.name) {
      this.name = newDetails.name;
    }
    if (newDetails.description) {
      this.description = newDetails.description;
    }
    // Update other properties as necessary
  }

  static fromDto(campaignDto: CreateGoogleSearchCampaignDto): GoogleSearchCampaign {
    console.log('Creating Google Search dto:', campaignDto);
    return new GoogleSearchCampaign(
      '123',
      campaignDto.name,
      campaignDto.keywords,
    );
  }
}