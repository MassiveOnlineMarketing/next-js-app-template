'use server';

import { db } from "@/infrastructure/db/prisma";

export const fetchWebsitesWithGoogleSearchCampaigns = async (userId: string) => {

  const res = await db.website.findMany({
    where: {
      userId: userId
    },
    include: {
      googleSearchCampaign: true
    }
  })

  return res;
}