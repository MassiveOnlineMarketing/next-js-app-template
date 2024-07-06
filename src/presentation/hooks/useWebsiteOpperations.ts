import { useState } from 'react';
import { createWebsite } from '@/application/useCases/website/createWebsite';
import { useToast } from '../components/toast/use-toast';
import { WebsiteSchemaType } from '@/application/schemas/websiteSchema';
// import { updateWebsite } from '@/application/useCases/website/updateWebsite';
// import { deleteWebsite } from '@/application/useCases/website/deleteWebsite';

function useWebsiteOperations() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleCreateWebsite = async (websiteData: WebsiteSchemaType) => {
    setIsLoading(true);
    try {
      const response = await createWebsite(websiteData);
      console.log('create website response (useHook):', response);
      
      if (response.error) {
        showErrorToast(response.error);
        return { success: false };
      } else {
        showSuccessToast('Website created successfully!');
        return { success: true };
      }
    } catch (error: any) { 
      showErrorToast(error.message || 'Unknown error');
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