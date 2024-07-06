'use server'

import { CreateWebsiteDto } from '@/application/dto/WebsiteDto';
import { WebsiteService } from '@/application/services/WebsiteService';

import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';

export async function getAllWebsites () {
  const websiteService = new WebsiteService(websiteRepository);

  try {
    const websites = await websiteService.getAllWebsites();

    return websites;
  } catch (error) {
    throw new Error(`Error getting websites ${error}`);
  }
}