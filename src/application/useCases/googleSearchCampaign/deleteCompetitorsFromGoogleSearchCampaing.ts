'use server';

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";

/**
 * Deletes competitors from a Google Search Campaign.
 * @param campaignId - The ID of the campaign.
 * @param competitors - An array of competitor names to be deleted.
 * @returns A promise that resolves to an object with a success property indicating whether the competitors were deleted successfully, or an error property with the error message if an error occurred.
 */
export async function deleteCompetitorsFromGoogleSearchCampaign(
  campaignId: string,
  competitors: string[],
) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const deleted = await googleSearchCampaignService.deleteCompetitors(campaignId, competitors);

    return { success: deleted };
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error deleting competitors for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('deleteCompetitorsFromGoogleSearchCampaign', error);
    return { success: false, error: 'Something happend please try again later' };
  }
}