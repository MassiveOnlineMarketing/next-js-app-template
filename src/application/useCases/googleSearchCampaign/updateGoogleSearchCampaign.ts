'use server';

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

// Schemas
import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";
import { GoogleSearchCampaignSchema, GoogleSearchCampaignSchemaType } from "@/application/schemas/googleSearchCampaignSchema";
import { UpdateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";

/**
 * Updates a Google Search Campaign.
 * @param values - The updated values for the campaign.
 * @param campaignId - The ID of the campaign to update.
 * @param competitors - Optional array of competitor names.
 * @returns An object indicating the success status and any error or updated campaign data.
 */
export async function updateGoogleSearchCampaign(
  values: GoogleSearchCampaignSchemaType,
  campaignId: string,
  gscUrl?: string | null,
  competitors?: string[],
) {
  const validateFields = GoogleSearchCampaignSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, error: validateFields.error?.message[0] };
  }

  if (!campaignId) {
    return { success: false, error: 'Campaign not found' };
  }

  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const campaignData: UpdateGoogleSearchCampaignDto = {
    ...values,
    userId: session.user.id,
    campaignId: campaignId,
    competitors: competitors ?? null,
    gscSite: gscUrl ?? null,
  };

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const updatedCampaign = await googleSearchCampaignService.updateCampaign(campaignId, campaignData);

    return { success: true, data: updatedCampaign };
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error updating campaign for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getGoogleSearchCampaignById', error);
    return { success: false, error: 'Something happend please try again later' };
  }
}