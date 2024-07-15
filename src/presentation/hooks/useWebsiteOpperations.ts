// Hook
import { useState } from 'react';
import { useToast } from '../components/toast/use-toast';
import { useWebsiteDetailsStore } from '../stores/website-details-store';

// Schema
import { WebsiteInputSchemaType } from '@/application/schemas/websiteSchema';

// Use cases
import { createWebsite } from '@/application/useCases/website/createWebsite';
import { updateWebsite } from '@/application/useCases/website/updateWebsite';



function useWebsiteOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const setWebsiteDetails = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
  const addWebsiteToStore = useWebsiteDetailsStore((state) => state.addWebsite);
  const updateWebsiteInStore = useWebsiteDetailsStore((state) => state.updateWebsite);

  const handleCreateWebsite = async (websiteData: WebsiteInputSchemaType) => {
    setIsLoading(true);
    try {
      const response = await createWebsite(websiteData);
      console.log('create website response (useHook):', response);
      
      if (response.success) {
        if (response.data) {
          setWebsiteDetails(response.data);
          addWebsiteToStore(response.data);
          showSuccessToast('Website created successfully!');
          return { success: true };
        }
        return { success: false };
      } else {
        showErrorToast(response.error?.message || 'Unknown error');
        return { success: false };
      }
    } catch (error: any) { 
      console.error('error creating website:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWebsite = async (websiteData: WebsiteInputSchemaType, websiteId: string) => {
    setIsLoading(true);
    try {
      const response = await updateWebsite(websiteData, websiteId);

      if (response.success) {
        updateWebsiteInStore(response.success)
        setWebsiteDetails(response.success);
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

  // const handleDeleteWebsite = async (websiteId) => {
  //   setIsLoading(true);
  //   try {
  //     await deleteWebsite(websiteId);
  //     toast.success('Website deleted successfully!');
  //     setIsLoading(false);
  //   } catch (error) {
  //     toast.error(`Error deleting website: ${error.message}`);
  //     setIsLoading(false);
  //     throw error;
  //   }
  // };

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

  // return { handleCreateWebsite, handleUpdateWebsite, handleDeleteWebsite, isLoading };
  return { handleCreateWebsite, handleUpdateWebsite, isLoading };
}



export default useWebsiteOperations;