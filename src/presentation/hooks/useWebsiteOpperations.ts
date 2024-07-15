import { useState } from 'react';
import { createWebsite } from '@/application/useCases/website/createWebsite';
import { useToast } from '../components/toast/use-toast';
import { WebsiteInputSchemaType } from '@/application/schemas/websiteSchema';
import { useWebsiteDetailsStore } from '../stores/website-details-store';
// import { updateWebsite } from '@/application/useCases/website/updateWebsite';
// import { deleteWebsite } from '@/application/useCases/website/deleteWebsite';

function useWebsiteOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const setWebsiteDetails = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
  const addWebsiteToStore = useWebsiteDetailsStore((state) => state.addWebsite);

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

  // const handleUpdateWebsite = async (websiteId, websiteData) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await updateWebsite(websiteId, websiteData);
  //     toast.success('Website updated successfully!');
  //     setIsLoading(false);
  //     return response;
  //   } catch (error) {
  //     toast.error(`Error updating website: ${error.message}`);
  //     setIsLoading(false);
  //     throw error;
  //   }
  // };

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
  return { handleCreateWebsite, isLoading };
}



export default useWebsiteOperations;