import { db } from "../db/prisma";

import { TKeyword } from "@/domain/serpTracker/enitities/GoogleSearchKeyword";
import { IGoogleSearchKeywordRepository } from "@/domain/serpTracker/repository/IGoogleSearchKeywordRepository";
import { GoogleSearchKeywordTag } from "@/domain/serpTracker/models/GoogleSearchKeywordTag";

import { utilityService } from "@/application/services/UtitlityService";

class GoogleSearchKeywordRepository implements IGoogleSearchKeywordRepository {
  async createBulk(keywords: TKeyword[]): Promise<boolean> {

    // Need to map the keywords to the format that the database expects 
    // Project instead of Campaign
    const keywordsData = keywords.map(keyword => {
      return {
        id: keyword.id,
        keyword: keyword.keyword,
        googleSearchCampaignId: keyword.googleSearchCampaignId,
        createdAt: keyword.createdAt
      }
    });

    const res = await db.googleSearchKeyword.createMany({
      data: keywordsData
    });

    return !!res;
  }

  async getTagByName(tag: string): Promise<GoogleSearchKeywordTag | null> {
    const res = await db.googleSearchKeywordTag.findFirst({
      where: {
        name: tag
      }
    });

    return res;
  }

  async createTag(tag: GoogleSearchKeywordTag, keywordIds: string[]): Promise<boolean> {
    const res = await db.googleSearchKeywordTag.create({
      data: {
        id: tag.id,
        name: tag.name,
        keywords: {
          connect: keywordIds.map(id => ({ id }))
        }
      }
    });

    return !!res;
  }

  async addTagToKeywords(
    tagId: string,
    keywordIds: string[],
  ) {

    const updateKeywordsBatch = async (batch: string[]) => {
      const keywords = await Promise.all(
        batch.map((keywordId) => {
          return db.googleSearchKeyword.update({
            where: {
              id: keywordId,
            },
            data: {
              tags: {
                connect: {
                  id: tagId,
                },
              },
            },
          });
        }),
      );
  
      return keywords;
    };
    
    const UtilityService = new utilityService()

    const results = await UtilityService.processArrayInBatches(
      keywordIds,
      updateKeywordsBatch,
      250,
    );
  
    return results;
  };

  async deleteTagFromKeywords(tagId: string, keywordId: string[]): Promise<boolean>{
    const res = await db.googleSearchKeywordTag.update({
      where: {
        id: tagId
      },
      data: {
        keywords: {
          disconnect: keywordId.map(id => ({ id }))
        }
      }
    });

    return !!res;
  }
}

const googleSearchKeywordRepository = new GoogleSearchKeywordRepository();

export default googleSearchKeywordRepository;