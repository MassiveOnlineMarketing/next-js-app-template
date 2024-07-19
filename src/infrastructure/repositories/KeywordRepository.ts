import { TKeyword } from "@/domain/serpTracker/enitities/Keyword";
import { IKeywordRepository } from "@/domain/serpTracker/repository/IkeywordRepository";

import { db } from "../db/prisma";

class KeywordRepository implements IKeywordRepository {
  async createBulk(keywords: TKeyword[]): Promise<boolean> {

    // Need to map the keywords to the format that the database expects 
    // Project instead of Campaign
    const keywordsData = keywords.map(keyword => {
      return {
        id: keyword.id,
        keyword: keyword.keyword,
        googleSearchProjectId: keyword.googleSearchCampaignId,
        createdAt: keyword.createdAt
      }
    });

    const res = await db.googleSearchKeyword.createMany({
      data: keywordsData
    });

    return !!res;
  }
}

const keywordRepository = new KeywordRepository();

export default keywordRepository;