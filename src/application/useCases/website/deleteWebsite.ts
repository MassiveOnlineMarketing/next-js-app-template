'use server';

import { auth, AuthService } from "@/application/services/AuthService";
import { WebsiteService } from "@/application/services/WebsiteService";
import { websiteDomainService } from "@/domain/_service/WebsiteDomainService";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";

export async function deleteWebsite(websiteId: string) {
  const session = await auth();

  if (!session?.user.id) {
    return { error: "User not authenticated or session expired" };
  }

  const websiteService = new WebsiteService(new AuthService, websiteRepository, websiteDomainService);

  try {
    const deleteWebsite = await websiteService.deleteWebsite(websiteId);
    if (deleteWebsite) {
      return { success: true };
    } else {
      return { error: "Website not found" };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error deleting website ${errorMessage}`);
    return { error: errorMessage };
    
  }

}