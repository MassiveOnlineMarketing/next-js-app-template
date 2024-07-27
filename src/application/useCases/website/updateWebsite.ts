'use server';

import { UpdateWebsiteDto } from "@/application/dto/WebsiteDto";
import { WebsiteInputSchema } from "@/application/schemas/websiteSchema";
import { auth, AuthService } from "@/application/services/AuthService";
import { WebsiteService } from "@/application/services/WebsiteService";
import { websiteDomainService } from "@/domain/_service/WebsiteDomainService";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";
import { z } from "zod";


export async function updateWebsite(
  values: z.infer<typeof WebsiteInputSchema>,
  websiteId : string
) {

  // Check form data with Zod
  const validatedFields = WebsiteInputSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // Get user session
  const session = await auth()
  if (!session?.user.id) {
    return { error: "User not authenticated or session expired" };
  }

  // Create website data
  const websiteData: UpdateWebsiteDto = {
    websiteName: values.websiteName,
    domainUrl: values.domainUrl,
    gscUrl: values.gscUrl,
    id: websiteId,
    userId: session.user.id,
  };

  // Create website service
  const websiteService = new WebsiteService(new AuthService, websiteRepository, websiteDomainService);

  try {
    const updateWebsite = await websiteService.updateWebsite(websiteData);

    return { success: updateWebsite };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`Error updating website ${errorMessage}`);
    return { error: errorMessage };
  }

}