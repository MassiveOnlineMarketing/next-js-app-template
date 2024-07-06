'use server';

import { CreateWebsiteDto } from '@/application/dto/WebsiteDto';
import { WebsiteService } from '@/application/services/WebsiteService';
import { websiteDomainService } from '@/domain/_service/WebsiteDomainService';

import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';


export async function createWebsite(websiteDto: CreateWebsiteDto) {

  const websiteService = new WebsiteService(websiteRepository, websiteDomainService);
  
  try {
    const createdWebsite = await websiteService.createWebsite(websiteDto);

    return {success: createdWebsite};
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error creating website ${errorMessage}`);
    return {error: errorMessage};
  }
}