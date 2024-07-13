'use server';

import { CreateWebsiteDto } from '@/application/dto/WebsiteDto';
import { WebsiteService } from '@/application/services/WebsiteService';

import { websiteDomainService } from '@/domain/_service/WebsiteDomainService';
import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';


//* Gets the request from the client and creates a new website entity.
export async function createWebsite(websiteDto: CreateWebsiteDto) {

  const websiteService = new WebsiteService(websiteRepository, websiteDomainService);

  //TODO: Check form data with Zod  

  //TODO: Sanitize form data

  try {
    const createdWebsite = await websiteService.createWebsite(websiteDto);

    return { success: true, data: createdWebsite };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error creating website ${errorMessage}`);
    return { success: false, error: { message: 'Something happend please try again later' } };
  }
}