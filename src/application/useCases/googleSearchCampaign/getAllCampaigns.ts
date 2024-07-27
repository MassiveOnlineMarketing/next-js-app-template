'use server'

// Services
import { AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";

/**
 * Retrieves all campaigns from the Google Search Campaign service.
 * 
 * @returns A promise that resolves to an object with the success status and the retrieved campaigns.
 *          If the user is not an administrator, the promise resolves to an object with the success status and an error message.
 *          If an error occurs during the retrieval process, the promise resolves to an object with the success status and an error message.
 */
export async function getAllCampaigns() {
  const authService = new AuthService;

  const isAdministrator = await authService.isAdmin();
  if (!isAdministrator) {
    return { success: false, error: 'User is not an administrator' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);
  try {
    const campaigns = await googleSearchCampaignService.getAllCampaigns();

    return {success: true, data: campaigns};
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error getting campaigns ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getAllCampaigns',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}