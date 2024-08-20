// Hook
import { useState } from 'react';
import { useToast } from '../components/toast/use-toast';
import { useWebsiteDetailsStore } from '../stores/website-details-store';
import { useCurrentUser } from '../auth/hooks/user-current-user';

// Schema
import { WebsiteInputSchemaType } from '@/application/schemas/websiteSchema';

// Use cases
import { createWebsite } from '@/application/useCases/website/createWebsite';
import { updateWebsite } from '@/application/useCases/website/updateWebsite';
import { deleteWebsite } from '@/application/useCases/website/deleteWebsite';



/**
 * Custom hook for website operations.
 * Provides functions for creating, updating, and deleting websites.
 * Also manages loading state and displays toast messages.
 *
 * @returns An object containing the website operation functions and loading state.
 */
function useWebsiteOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { setWebsiteDetails, removeWebsiteFromStore, resetWebsiteDetails, addWebsiteToStore, updateWebsiteInStore } = useWebsiteDetailsStore(state => ({
    addWebsiteToStore: state.addWebsite,
    updateWebsiteInStore: state.updateWebsite,
    setWebsiteDetails: state.setWebsiteDetails,
    removeWebsiteFromStore: state.removeWebsite,
    resetWebsiteDetails: state.resetWebsiteDetails
  }));
  const user = useCurrentUser();

  /**
   * Handles the creation of a website with toast messages.
   * 
   * @param websiteData - The data for the website to be created.
   * @returns A promise that resolves to an object indicating the success of the operation.
   */
  const handleCreateWebsite = async (websiteData: WebsiteInputSchemaType) => {
    setIsLoading(true);
    try {
      const response = await createWebsite(websiteData);
      console.log('create website response (useHook):', response);
      
      if (response.success) {
        if (response.data) {
          if (user?.id) {
            setWebsiteDetails(response.data, user?.id);
          }
          addWebsiteToStore(response.data);
          showSuccessToast('Website created successfully!');
          return { success: true };
        }
        return { success: false };
      } else {
        showErrorToast(response.error || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) { 
      console.error('error creating website:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates a website with the provided data with toast messages.
   * @param websiteData - The data to update the website with.
   * @param websiteId - The ID of the website to update.
   * @returns A promise that resolves to an object with a `success` property indicating whether the update was successful.
   */
  const handleUpdateWebsite = async (websiteData: WebsiteInputSchemaType, websiteId: string) => {
    setIsLoading(true);
    try {
      const response = await updateWebsite(websiteData, websiteId);

      if (response.success) {
        updateWebsiteInStore(response.success)
        if (user?.id) {
          setWebsiteDetails(response.success, user?.id);
        }
        showSuccessToast('Website updated successfully!');
        return { success: true };
      } else {
        showErrorToast(response.error || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) {
      console.error('error updating website:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles the deletion of a website  with toast messages.
   * 
   * @param websiteId - The ID of the website to be deleted.
   * @returns An object indicating the success of the deletion operation.
   */
  const handleDeleteWebsite = async (websiteId: string) => {
    setIsLoading(true);
    try {
      const response = await deleteWebsite(websiteId);

      if (response.success) {
        removeWebsiteFromStore(websiteId);
        if (user?.id) {
          resetWebsiteDetails(user?.id);
        }
        showSuccessToast('Website deleted successfully!');
        return { success: true };
      } else {
        showErrorToast(response.error || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) {
      console.error('error deleting website:', error);
      showErrorToast(`Error deleting website`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

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

  return { handleCreateWebsite, handleUpdateWebsite, handleDeleteWebsite, isLoading };
}



export default useWebsiteOperations;