// src/application/services/GoogleSearchCampaignService.ts

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { IGoogleSearchCampaignRepository } from "@/domain/serpTracker/repository/IGoogleSearchCampaignRepository";
import { CreateGoogleSearchCampaignDto } from "../dto/GoogleSearchCampaignDto";



export class GoogleSearchCampaignService {
    constructor(private campaignRepository: IGoogleSearchCampaignRepository) {}

    async createCampaign(campaignDto: CreateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
        // Convert DTO to domain entity
        const campaign = GoogleSearchCampaign.fromDto(campaignDto);
        console.log('Google Search Campaign Entity:', campaign);
        // Validate business rules and invariants
        // For example, check if the campaign name is unique, etc.
        // This can be done within the GoogleSearchCampaign entity or by using a domain service

        // Persist the campaign entity using the repository
        return await this.campaignRepository.create(campaign);
    }

    async updateCampaign(id: string, campaignDto: CreateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
        // Fetch the existing campaign
        const campaign = await this.campaignRepository.findById(id);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // Update the campaign entity with new values
        campaign.update(campaignDto);
        // Validate any business rules as necessary

        // Persist the updated campaign
        return await this.campaignRepository.update(id, campaign);
    }

    async deleteCampaign(id: string): Promise<void> {
        // Check if the campaign exists
        const campaign = await this.campaignRepository.findById(id);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // Delete the campaign
        await this.campaignRepository.delete(id);
    }
}