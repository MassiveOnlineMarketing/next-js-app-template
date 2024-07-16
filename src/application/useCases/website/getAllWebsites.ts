'use server'

import { AuthService } from '@/application/services/AuthService';
import { WebsiteService } from '@/application/services/WebsiteService';
import { websiteDomainService } from '@/domain/_service/WebsiteDomainService';

import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';

export async function getAllWebsites () {
  const authService = new AuthService;

  const isAdministrator = await authService.isAdmin();
  if (!isAdministrator) {
    throw new Error('Unauthorized');
  }
  
  const websiteService = new WebsiteService(authService, websiteRepository, websiteDomainService);

  try {
    const websites = await websiteService.getAllWebsites();

    return websites;
  } catch (error) {
    throw new Error(`Error getting websites ${error}`);
  }
}