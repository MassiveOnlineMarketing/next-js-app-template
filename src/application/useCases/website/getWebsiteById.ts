'use server';

import { auth, AuthService } from "@/application/services/AuthService";
import { WebsiteService } from "@/application/services/WebsiteService";
import { websiteDomainService } from "@/domain/_service/WebsiteDomainService";
import { SimpleError } from "@/domain/errors/simpleErrors";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";

export async function getWebsiteById(websiteId: string) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const websiteService = new WebsiteService(new AuthService, websiteRepository, websiteDomainService);

  try {
    const website = await websiteService.getById(websiteId);

    return { success: true, data: website };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error getting website for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    } else {
      console.error('getWebsiteById', error);
      return { success: false, error: 'Something happend please try again later' };
    }
  }
}