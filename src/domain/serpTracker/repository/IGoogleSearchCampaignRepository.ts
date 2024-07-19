// src/domain/googleSearchConsole/repositories/IGoogleSearchProjectRepository.ts

import { CreateGoogleSearchCampaignDto, UpdateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";
import { GoogleSearchCampaign } from "../enitities/GoogleSearchCampaign";
import { GoogleSearchCompetitor } from "@prisma/client";


/**
 * Represents a repository for managing Google Search Campaigns.
 */
export interface IGoogleSearchCampaignRepository {
  /**
   * Creates a new Google Search Campaign.
   * @param campaign - The campaign data.
   * @returns A promise that resolves to the created GoogleSearchCampaign object.
   */
  create(campaign: CreateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign>;

  /**
   * Updates an existing Google Search Campaign.
   * @param id - The ID of the campaign to update.
   * @param campaign - The updated campaign data.
   * @returns A promise that resolves to the updated GoogleSearchCampaign object.
   */
  update(id: string, campaign: UpdateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign>;

  /**
   * Deletes a Google Search Campaign.
   * @param id - The ID of the campaign to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Retrieves all Google Search Campaigns associated with a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of GoogleSearchCampaign objects.
   */
  getByUserId(userId: string): Promise<GoogleSearchCampaign[]>;

  /**
   * Retrieves a Google Search Campaign by its ID.
   * @param id - The ID of the campaign.
   * @returns A promise that resolves to the retrieved GoogleSearchCampaign object, or null if not found.
   */
  getById(id: string): Promise<GoogleSearchCampaign | null>;

  /**
   * Retrieves a Google Search Campaign by its associated website ID.
   * @param websiteId - The ID of the website.
   * @returns A promise that resolves to the retrieved GoogleSearchCampaign object, or null if not found.
   */
  getByWebsiteId(websiteId: string): Promise<GoogleSearchCampaign[]>;

  /**
   * Retrieves all Google Search Campaigns.
   * @returns A promise that resolves to an array of GoogleSearchCampaign objects.
   */
  getAll(): Promise<GoogleSearchCampaign[]>;

  /**
   * Deletes competitors from a Google Search Campaign.
   * @param campaignId - The ID of the campaign.
   * @param competitors - An array of competitor names to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  deleteCompetitors(campaignId: string, competitors: string[]): Promise<boolean>;

  /**
   * Retrieves competitors associated with a Google Search Campaign.
   * @param campaignId - The ID of the campaign.
   * @returns A promise that resolves to an array of GoogleSearchCompetitor objects.
   */
  getCompetitorsByCampaignId(campaignId: string): Promise<GoogleSearchCompetitor[]>;
}