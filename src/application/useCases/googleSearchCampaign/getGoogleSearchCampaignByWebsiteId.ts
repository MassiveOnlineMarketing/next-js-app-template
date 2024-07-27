'use server';

import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

export const getGoogleSearchCampaignByWebsiteId = async (websiteId: string) => {
  const session = await auth();
  const currentUserId = session?.user.id;
  if (!currentUserId) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    console.log(`Getting campaign for user by website id: ${session.user.id}`);
    const campaigns = await googleSearchCampaignService.getByWebsiteId(websiteId);

    return { success: true, data: campaigns };
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error getting campaign for user by website id: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getGoogleSearchCampaignByWebsiteId', error);
    return { success: false, error: 'Something happend please try again later' };
  }
}