import { db } from "../db/prisma";

import { SerperApiResult } from "@/domain/serpTracker/enitities/SerperApiResult";
import { GoogleSearchCompetitorResult } from "@/domain/serpTracker/enitities/GoogleSearchCompetitorResult";
import { GoogleSearchApiUserResult } from "@/domain/serpTracker/enitities/GoogleSearchApiUserResult";
import { GoogleSearchSerpResult } from "@prisma/client";

import { IGoogleSearchSerpResultRepository } from "@/domain/serpTracker/repository/IGoogleSearchSerpResultRepository";

class GoogleSearchSerpResultRepository implements IGoogleSearchSerpResultRepository {
  async insertSerpResults(data: SerperApiResult[]): Promise<boolean> {
    const resultData = data.map((keyword) => {
      return {
        keywordId: keyword.keywordId,
        position: keyword.position,
        url: keyword.url,
        metaTitle: keyword.metaTitle,
        metaDescription: keyword.metaDescription,
      };
    });
  
    const resultInsert = await db.googleSearchSerpResult.createMany({
      data: resultData,
    });
  
    return !!resultInsert;
  }

  async insertCompetitorResults(
    data: GoogleSearchCompetitorResult[]
  ): Promise<boolean> {
    const resultInsert = await db.googleSearchCompetitorResult.createMany({
      data: data,
    });

    return !!resultInsert;
  }

  async insertUserResults(data: GoogleSearchApiUserResult[]): Promise<boolean> {
    const resultInsert = await db.googleSearchResult.createMany({
      // @ts-ignore   Happens because of the data types relatedSearches, peopleAlsoAsk and siteLinks, but it's not a problem
      data: data,
    });

    return !!resultInsert;
  }

  async getLatestResults(keywordIds: string[]) {
    const results = await db.googleSearchResult.findMany({
      where: {
        keywordId: {
          in: keywordIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        keyword: {
          include: {
            tags: true,
            keywordMetrics: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      }
    });

    return results;
  }

  async getLatestResultsByCampaignId(campaignId: string) {
    const results = await db.googleSearchCampaign.findFirst({
      where: {
        id: campaignId,
      },
      include: {
        keyword: {
          include: {
            tags: true,
            keywordMetrics: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
            result: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          }
        }
      },
    });

    return results;
  }

  async getTopTenSerpResults(keywordId: string): Promise<GoogleSearchSerpResult[]> {
    const results = await db.googleSearchSerpResult.findMany({
      where: {
        keywordId: keywordId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return results;
  }

}

const googleSearchSerpResultRepository = new GoogleSearchSerpResultRepository();
export default googleSearchSerpResultRepository;