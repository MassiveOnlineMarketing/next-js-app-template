'use server';

import { CreateWebsiteDto } from '@/application/dto/WebsiteDto';
import { WebsiteInputSchema } from '@/application/schemas/websiteSchema';
import { auth, AuthService } from '@/application/services/AuthService';
import { WebsiteService } from '@/application/services/WebsiteService';

import { websiteDomainService } from '@/domain/_service/WebsiteDomainService';
import websiteRepository from '@/infrastructure/repositories/WebsiteRepository';
import { z } from 'zod';

/**
 * Creates a new website.
 * 
 * @param values - The website data.
 * @returns A promise that resolves to the created website entity.
 */
export async function createWebsite(values: z.infer<typeof WebsiteInputSchema>) {

  // Check form data with Zod
  const validatedFields = WebsiteInputSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  // Get user session
  const session = await auth();
  if (!session?.user.id) {
    return { error: 'User not authenticated or session expired' };
  }

  // Create website data
  const websiteDto: CreateWebsiteDto = {
    websiteName: values.websiteName,
    domainUrl: values.domainUrl,
    gscUrl: values.gscUrl,
  };

  // Create website service
  const websiteService = new WebsiteService(new AuthService, websiteRepository, websiteDomainService);

  try {
    const createdWebsite = await websiteService.createWebsite(websiteDto);

    return { success: true, data: createdWebsite };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error creating website ${errorMessage}`);
    return { success: false, error: 'Something happend please try again later' };
  }
}