// src/application/services/GoogleSearchCampaignService.ts

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { IGoogleSearchCampaignRepository } from "@/domain/serpTracker/repository/IGoogleSearchCampaignRepository";
import { CreateGoogleSearchCampaignDto, UpdateGoogleSearchCampaignDto } from "../dto/GoogleSearchCampaignDto";
import { AuthService } from "./AuthService";
import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";
import { GoogleSearchCompetitor } from "@prisma/client";



/**
 * Service class for managing Google Search campaigns.
 */
export class GoogleSearchCampaignService {
  private campaignRepository: IGoogleSearchCampaignRepository;
  private authService: AuthService;

  constructor(
    campaignRepository: IGoogleSearchCampaignRepository,
    authService: AuthService
  ) {
    this.campaignRepository = campaignRepository;
    this.authService = authService;
  }

  /**
   * Creates a Google Search campaign.
   * 
   * @param data - The data for creating the campaign.
   * @returns A promise that resolves to the created GoogleSearchCampaign.
   * @throws {GoogleSearchError} If the user is unauthorized.
   */
  async createCampaign(data: CreateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }

    return this.campaignRepository.create(data);
  }

  /**
   * Updates a Google Search campaign.
   * 
   * @param id - The ID of the campaign to update.
   * @param data - The updated data for the campaign.
   * @returns A Promise that resolves to the updated GoogleSearchCampaign object.
   * @throws {GoogleSearchError} If the user is unauthorized, the campaign is not found, or the campaign does not belong to the user.
   */
  async updateCampaign(id: string, data: UpdateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }
    
    const campaign = await this.campaignRepository.getById(id);
    if (!campaign) {
      throw new GoogleSearchError(404, 'Campaign not found');
    }
    if (campaign.userId !== user.id) {
      throw new GoogleSearchError(403, 'Campaing does not belong to user');
    }

    return this.campaignRepository.update(id, data);
  }

  /**
   * Deletes a campaign by its ID.
   * 
   * @param id - The ID of the campaign to delete.
   * @returns A Promise that resolves to a boolean indicating whether the campaign was successfully deleted.
   * @throws {GoogleSearchError} If the user is not authorized, the campaign is not found, or the campaign does not belong to the user.
   */
  async deleteCampaign (id: string): Promise<boolean> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }

    const campaign = await this.campaignRepository.getById(id);
    if (!campaign) {
      throw new GoogleSearchError(404, 'Campaign not found');
    }
    if (campaign.userId !== user.id) {
      throw new GoogleSearchError(403, 'Campaing does not belong to user');
    }

    return this.campaignRepository.delete(id);
  }

  /**
   * Retrieves a GoogleSearchCampaign by its ID.
   * 
   * @param id - The ID of the GoogleSearchCampaign to retrieve.
   * @returns A Promise that resolves to the retrieved GoogleSearchCampaign, or null if not found.
   * @throws {GoogleSearchError} If the user is unauthorized, the campaign is not found, or the campaign does not belong to the user.
   */
  async getById(id: string): Promise<GoogleSearchCampaign | null> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }

    const campaing = await this.campaignRepository.getById(id);
    if (!campaing) {
      throw new GoogleSearchError(404, 'Campaign not found');
    }

    if (campaing.userId !== user.id) {
      throw new GoogleSearchError(403, 'Campaing does not belong to user');
    }
    
    return campaing;
  }

  /**
   * Retrieves Google search campaigns by user ID.
   * 
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of GoogleSearchCampaign objects.
   */
  getByUserId(userId: string): Promise<GoogleSearchCampaign[]> {
    return this.campaignRepository.getByUserId(userId);
  }

  /**
   * Retrieves all Google search campaigns.
   * @returns A promise that resolves to an array of GoogleSearchCampaign objects.
   */
  getAllCampaigns(): Promise<GoogleSearchCampaign[]> {
    return this.campaignRepository.getAll();
  }

  /**
   * Deletes competitors from a Google search campaign.
   * 
   * @param campaignId - The ID of the campaign.
   * @param competitors - An array of competitor names to be deleted.
   * @returns A promise that resolves to a boolean indicating whether the competitors were successfully deleted.
   * @throws {GoogleSearchError} If the user is unauthorized, the campaign is not found, or the campaign does not belong to the user.
   */
  async deleteCompetitors(campaignId: string, competitors: string[]): Promise<boolean> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }
    
    const campaign = await this.campaignRepository.getById(campaignId);
    if (!campaign) {
      throw new GoogleSearchError(404, 'Campaign not found');
    }
    if (campaign.userId !== user.id) {
      throw new GoogleSearchError(403, 'Campaing does not belong to user');
    }

    return this.campaignRepository.deleteCompetitors(campaignId, competitors);
  
  }

  /**
   * Retrieves the competitors for a given campaign ID.
   * 
   * @param campaignId - The ID of the campaign.
   * @returns A promise that resolves to an array of GoogleSearchCompetitor objects.
   * @throws {GoogleSearchError} If the user is unauthorized.
   */
  async getCompetitorsByCampaignId(campaignId: string): Promise<GoogleSearchCompetitor[]> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new GoogleSearchError(401, 'Unauthorized');
    }

    return this.campaignRepository.getCompetitorsByCampaignId(campaignId);
  }
}