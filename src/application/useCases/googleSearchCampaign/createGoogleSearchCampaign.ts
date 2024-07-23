'use server';

// Services
import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

import { GoogleSearchCampaignSchema, GoogleSearchCampaignSchemaType } from "@/application/schemas/googleSearchCampaignSchema";
import { GoogleSearchError } from "@/domain/errors/googleSearchErrors";
import { GoogleSearchLocation } from "@/domain/models/serperApi";
import { CreateGoogleSearchCampaignDto } from "@/application/dto/GoogleSearchCampaignDto";


/**
 * Creates a Google Search Campaign.
 * 
 * @param values - The values for the Google Search Campaign.
 * @param websiteId - The ID of the website associated with the campaign.
 * @param domainUrl - The domain URL of the website associated with the campaign.
 * @param location - The location for the Google Search Campaign.
 * @param competitors - Optional. An array of competitor URLs.
 * @returns An object indicating the success status and the created campaign data, or an error message.
 */
export async function createGoogleSearchCampaign(
  values: GoogleSearchCampaignSchemaType,
  websiteId: string,
  domainUrl: string,
  location: GoogleSearchLocation | null,
  competitors?: string[],
) {

  const validateFields = GoogleSearchCampaignSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, error: 'Invalid fields!' };
  }

  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const campaignData: CreateGoogleSearchCampaignDto = {
    userId: session.user.id,
    domainUrl: domainUrl,
    websiteId: websiteId,
    competitors: competitors ?? null,
    projectName: values.projectName,
    language: values.language,
    location: location,
    country: values.country,
    specificDaysOfWeek: values.specificDaysOfWeek,
    gscSite: values.gscSite || null,
    keywords: values.keywords || null,
  };

  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService);

  try {
    const createdCampaign = await googleSearchCampaignService.createCampaign(campaignData);

    return { success: true, data: createdCampaign };
  } catch (error) {
    if (error instanceof GoogleSearchError) {
      console.error(`Error getting campaign for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('getGoogleSearchCampaignById',error);
    return { success: false, error: 'Something happend please try again later' };
  }

}