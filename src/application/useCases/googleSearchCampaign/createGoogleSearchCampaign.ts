'use server';

// Import necessary dependencies
import { CreateGoogleSearchCampaignDto } from '@/application/dto/GoogleSearchCampaignDto';
import { GoogleSearchCampaignService } from '@/application/services/GoogleSearchCampaignService';
import googleSearchCampaignRepository from '@/infrastructure/repositories/GoogleSearchCampaignRepository';

// This could be a function or a class method, depending on your design preference
export async function createGoogleSearchProject(campaignDto: CreateGoogleSearchCampaignDto, userId: string) {
  console.log('Creating Google Search Project:', campaignDto);
  // Step 1: Validate the input data
  // This could involve checking if all required fields are present and valid in the campaignDto
  // For example, checking if the 'name' field is not empty, etc.

  // Step 2: Authenticate and Authorize
  // Ensure that the user is authenticated and authorized to create a Google Search Project
  // This might involve checking the user's role, permissions, etc.


  // Step 3: Instantiate the service responsible for creating the campaign
  const googleSearchCampaignService = new GoogleSearchCampaignService(googleSearchCampaignRepository);

  // Step 4: Call the service method to create the campaign
  try {
    const createdCampaign = await googleSearchCampaignService.createCampaign(campaignDto);
    // Optionally, perform any post-creation actions, like sending notifications, logging, etc.

    // At the end of createGoogleSearchProject function, before returning
    const serializableCampaign = {
      id: createdCampaign.id,
      name: createdCampaign.name,
      keywords: [...createdCampaign.keywords],
    };
    console.log('Google Search Project created successfully:', serializableCampaign);
    return serializableCampaign;
  } catch (error) {
    // Handle any errors, such as database errors, validation failures, etc.
    throw new Error(`Failed to create Google Search Project: ${error}`);
  }
}