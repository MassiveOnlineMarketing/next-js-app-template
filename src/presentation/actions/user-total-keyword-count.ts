"use server";

import { db } from "@/infrastructure/db/prisma";


export const userTotalKeywordCount = async (userId: string) => {
  const user = await db.googleSearchCampaign.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      campaignName: true,
      keyword: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return 0;
  }

  const keywordCountPerProject = user.map((project) => ({
    projectId: project.id,
    projectName: project.campaignName,
    keywordCount: project.keyword.length,
  }));

  return keywordCountPerProject;
};
