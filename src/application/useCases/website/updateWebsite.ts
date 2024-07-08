'use server';

import { UpdateWebsiteDto } from "@/application/dto/WebsiteDto";
import { WebsiteService } from "@/application/services/WebsiteService";
import { websiteDomainService } from "@/domain/_service/WebsiteDomainService";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";


export async function updateWebsite(websiteDto: UpdateWebsiteDto) {

  const websiteService = new WebsiteService(websiteRepository, websiteDomainService);

  //TODO: Check form data

  try {
    const updateWebsite = await websiteService.updateWebsite(websiteDto);

    return { success: updateWebsite };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error updating website ${errorMessage}`);
    return { error: errorMessage };
  }

}