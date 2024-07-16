'use server'

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { SimpleError } from "@/domain/errors/simpleErrors";

/**
 * Retrieves competitors for a Google Search Campaign by its ID.
 * @param campaignId - The ID of the Google Search Campaign.
 * @returns A promise that resolves to an object containing the success status and the competitors data.
 */
export async function getCompetitorsByGoogleSearchCampaignId(campaignId: string) {

  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const competitors = await googleSearchCampaignService.getCompetitorsByCampaignId(campaignId);
    
    return { success: true, data: competitors };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error getting competitors for campaign: ${campaignId}, ${error}`);
      return { success: false, error: error.message };
    } else {
      console.error('getCompetitorsByGoogleSearchCampaignId', error);
      return { success: false, error: 'Something happend please try again later' };
    }
  }
}