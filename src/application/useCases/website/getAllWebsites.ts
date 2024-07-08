'use server'

import { WebsiteService } from '@/application/services/WebsiteService';
import { websiteDomainService } from '@/domain/_service/WebsiteDomainService';

import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';

export async function getAllWebsites () {
  const websiteService = new WebsiteService(websiteRepository, websiteDomainService);

  try {
    const websites = await websiteService.getAllWebsites();

    return websites;
  } catch (error) {
    throw new Error(`Error getting websites ${error}`);
  }
}