'use server'

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";

/**
 * Retrieves a Google search campaign by user ID.
 * 
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an object containing the success status and the retrieved campaigns.
 *          If the user is not authenticated or the session has expired, the promise resolves to an object
 *          with the success status set to false and an error message.
 *          If an error occurs while retrieving the campaigns, the promise resolves to an object with the
 *          success status set to false and an error message.
 */
export async function getGoogleSearchCampaignByUserId(userId: string) {
  const session = await auth();
  const currentUserId = session?.user.id;

  if (!currentUserId) {
    return { succes: false, error: 'User not authenticated or session expired' };
  }

  if (userId !== currentUserId) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const campaigns = await googleSearchCampaignService.getByUserId(userId);

    return { success: true, data: campaigns };
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error getting campaign for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getGoogleSearchCampaignById', error);
    return { success: false, error: 'Something happend please try again later' };
  }
}