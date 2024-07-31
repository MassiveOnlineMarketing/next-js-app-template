'use server';

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";

import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";

/**
 * Retrieves a Google Search Campaign by its ID.
 * 
 * @param campaignId - The ID of the campaign to retrieve.
 * @returns A promise that resolves to an object containing the success status and the retrieved campaign data, or an error message.
 */
export async function getGoogleSearchCampaignById(campaignId: string) {
  const session = await auth();
  const currentUserId = session?.user.id;

  if (!currentUserId) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const campaigns = await googleSearchCampaignService.getById(campaignId);

    return {success: true, data: campaigns};
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error getting campaign for user: ${currentUserId}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getGoogleSearchCampaignById',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}