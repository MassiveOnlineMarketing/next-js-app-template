'use server'

import { AuthService } from "@/application/services/AuthService";
import { WebsiteService } from "@/application/services/WebsiteService";
import { websiteDomainService } from "@/domain/_service/WebsiteDomainService";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";


export async function getWebsiteByUserId (userId: string) {
  const websiteService = new WebsiteService(new AuthService, websiteRepository, websiteDomainService);

  try {
    const webistes = await websiteService.getWebsiteByUserId(userId);
    
    if (!webistes) {
      return { success: false, error: { message: 'No websites found' } };
    }

    return { success: true, data: webistes };
  } catch (error) {
    console.error('Error getting websites:', error);
    return { success: false, error: { message: 'Something happend please try again later' } };
  }
}