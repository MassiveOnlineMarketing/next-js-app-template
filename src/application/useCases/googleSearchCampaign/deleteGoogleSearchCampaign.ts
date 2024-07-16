'use server';

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { SimpleError } from "@/domain/errors/simpleErrors";

/**
 * Deletes a Google Search Campaign.
 * 
 * @param campaignId - The ID of the campaign to delete.
 * @returns A promise that resolves to an object with the success status of the deletion or an error property with the error message if an error occurred.
 */
export async function deleteGoogleSearchCampaign(
  campaignId: string,
) {
  const session = await auth();
  const currentUserId = session?.user.id;
  if (!currentUserId) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const deleted = await googleSearchCampaignService.deleteCampaign(campaignId);

    return { success: deleted };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error deleting campaign for user: ${currentUserId}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('deleteGoogleSearchCampaign', error);
    return { success: false, error: 'Something happend please try again later' };
  }
}