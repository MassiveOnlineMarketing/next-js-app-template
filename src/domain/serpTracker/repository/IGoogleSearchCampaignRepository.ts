// src/domain/googleSearchConsole/repositories/IGoogleSearchProjectRepository.ts

import { GoogleSearchCampaign } from "../enitities/GoogleSearchCampaign";



export interface IGoogleSearchCampaignRepository {
    create(project: GoogleSearchCampaign): Promise<GoogleSearchCampaign>;
    findById(id: string): Promise<GoogleSearchCampaign | null>;
    update(id: string, project: GoogleSearchCampaign): Promise<GoogleSearchCampaign>;
    delete(id: string): Promise<void>;
    // Other necessary operations, like search or list
}