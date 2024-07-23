
// Hooks
import { useState } from "react";
import { useToast } from "../components/toast/use-toast";

// Schema
import { GoogleSearchCampaignSchemaType } from "@/application/schemas/googleSearchCampaignSchema";
import { useGoogleSearchCampaignDetailsStore } from "../stores/google-search-campaign-store";


// Use cases
import { createGoogleSearchCampaign } from "@/application/useCases/googleSearchCampaign/createGoogleSearchCampaign";
import { updateGoogleSearchCampaign } from "@/application/useCases/googleSearchCampaign/updateGoogleSearchCampaign";
import { deleteCompetitorsFromGoogleSearchCampaign } from "@/application/useCases/googleSearchCampaign/deleteCompetitorsFromGoogleSearchCampaing";
import { deleteGoogleSearchCampaign } from "@/application/useCases/googleSearchCampaign/deleteGoogleSearchCampaign";


import { GoogleSearchLocation } from "@/domain/models/serperApi";

/**
 * Custom hook for handling Google search campaign operations.
 * Provides functions for creating, updating, and deleting Google search campaigns.
 * Also manages loading state and displays toast messages.
 * 
 * @returns An object containing the loading state and the functions for handling Google search campaigns.
 */
function useGoogleSearchCampaignOpperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { setGoogleSearchCampaignDetails, updateGoogleSearchCampaigns, removeCampaignFromList, addCampaignToList } = useGoogleSearchCampaignDetailsStore(state => ({
    setGoogleSearchCampaignDetails: state.setCampaignDetails,
    updateGoogleSearchCampaigns: state.updateCampaign,
    removeCampaignFromList: state.removeCampaignFromList,
    addCampaignToList: state.addCampaignToList
  }));

  /**
   * Handles the creation of a Google search campaign with toasts.
   * 
   * @param googleSearchCampaignData - The data for the Google search campaign.
   * @param location - The location for the Google search campaign.
   * @param websiteId - The ID of the website.
   * @param domainUrl - The domain URL of the website.
   * @param addCompetitors - An optional array of competitor URLs to add.
   * @returns An object indicating the success of the operation.
   */
  const handleCreateCampaign = async (
    googleSearchCampaignData: GoogleSearchCampaignSchemaType,
    location: GoogleSearchLocation | null,
    websiteId?: string,
    domainUrl?: string,
    addCompetitors?: string[],
  ) => {
    setIsLoading(true);

    if (!websiteId || !domainUrl) {
      console.error('Please add a wabsite first');
      showErrorToast('Please add a website first');
      return { success: false };
    }

    try {
      const response = await createGoogleSearchCampaign(googleSearchCampaignData, websiteId, domainUrl, location, addCompetitors);

      if (response.success) {
        if (response.data) {
          setGoogleSearchCampaignDetails(response.data);
          // Add project to campaign list
          addCampaignToList(response.data);
          showSuccessToast('Google search campaign created successfully!');
          return { success: true, campaignId: response.data.id };
          // TODO: Process keywords
        } else {
          showErrorToast(response.error || 'Unknown error');
          return { success: false };
        }
      }
    } catch (error: any) {
      console.error('error creating google search campaign:', error);
      showErrorToast('Error creating google search campaign');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates a Google search campaign with the provided data and toasts.
   * 
   * @param googleSearchCampaignData - The data to update the Google search campaign with.
   * @param campaignId - The ID of the campaign to update.
   * @param addCompetitors - An optional array of competitors to add to the campaign.
   * @param removeCompetitors - An optional array of competitors to remove from the campaign.
   * @returns A promise that resolves to an object indicating the success of the update operation.
   */
  const handleUpdateCampaign = async (
    googleSearchCampaignData: GoogleSearchCampaignSchemaType, 
    campaignId?: string, 
    addCompetitors?: string[],
    removeCompetitors?: string[]
  ) => {
    setIsLoading(true);

    if (!campaignId) {
      showErrorToast('Campaign not found');
      return {success: false }
    }

    try {
      if (removeCompetitors) {
        console.log('remove competitors:', removeCompetitors);
        const response = await deleteCompetitorsFromGoogleSearchCampaign(campaignId, removeCompetitors);
        if (!response.success) {
          showErrorToast('Error removing competitors');
          return { success: false };
        }
      }
      
      const response = await updateGoogleSearchCampaign(googleSearchCampaignData, campaignId, addCompetitors);
      
      if (response.success && response.data) {
        // Set the updated campaign details
        setGoogleSearchCampaignDetails(response.data);
        // Update the campaign list
        updateGoogleSearchCampaigns(response.data);
        showSuccessToast('Google search campaign updated successfully!');
        return { success: true };
      } else {
        showErrorToast(response.error || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) {
      console.error('error updating google search campaign:', error);
      showErrorToast('Error updating google search campaign');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a Google search campaign with toasts.
   * 
   * @param campaignId - The ID of the campaign to delete.
   * @returns A promise that resolves to an object indicating the success of the operation.
   */
  const handleDeleteCampaign = async (campaignId: string) => {
    setIsLoading(true);

    try {
      const response = await deleteGoogleSearchCampaign(campaignId);

      if (response.success) {
        // Remove the campaign from the list
        removeCampaignFromList(campaignId);
        showSuccessToast('Google search campaign deleted successfully!');
        return { success: true };
      } else {
        showErrorToast(response.error || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) {
      console.error('error deleting google search campaign:', error);
      showErrorToast('Error deleting google search campaign');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorToast = (message: string) => {
    toast({
      description: `Error creating website: ${message}`,
      variant: 'destructive',
    });
  };

  const showSuccessToast = (message: string) => {
    toast({
      icon: 'success',
      description: message,
      variant: 'success',
    });
  };

  return { isLoading, handleCreateCampaign, handleUpdateCampaign, handleDeleteCampaign };
}

export default useGoogleSearchCampaignOpperations;