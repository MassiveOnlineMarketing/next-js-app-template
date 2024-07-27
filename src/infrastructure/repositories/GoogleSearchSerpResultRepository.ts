import { db } from "../db/prisma";

import { IGoogleSearchSerpResultRepository } from "@/domain/serpTracker/repository/IGoogleSearchSerpResultRepository";
import { SerperApiResult } from "@/domain/serpTracker/enitities/SerperApiResult";
import { SerperApiUserResult } from "@/domain/serpTracker/enitities/SerperApiUserResult";

class GoogleSearchSerpResultRepository implements IGoogleSearchSerpResultRepository {
  async insertSerpResults(data: SerperApiResult[]): Promise<boolean> {
    const resultData = data.map((keyword) => {
      return {
        keywordId: keyword.keywordId,
        position: keyword.position,
        url: keyword.url,
        metaTitle: keyword.metaTitle,
        metaDescription: keyword.metaDescription || "",
      };
    });
  
    const resultInsert = await db.googleSearchSerpResult.createMany({
      data: resultData,
    });
  
    return !!resultInsert;
  }

  async insertUserResults(userResultData: SerperApiUserResult[]): Promise<number> {
    const resultData = userResultData.map((keyword) => {
      return {
        keywordId: keyword.keywordId,
        keywordName: keyword.resultName,
        position: keyword.resultPosition,
        url: keyword.resultURL,
        metaTitle: keyword.resultTitle,
        metaDescription: keyword.resultDescription,
        firstPosition: keyword.resultPosition,
        bestPosition: keyword.resultPosition,
        relatedSearches: keyword.relatedSearches,
        peopleAlsoAsk: keyword.peopleAlsoAsk,
      };
    });
  
    const res = await db.googleSearchResult.createMany({
      data: resultData,
    });

    return res.count;
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
}

const googleSearchSerpResultRepository = new GoogleSearchSerpResultRepository();
export default googleSearchSerpResultRepository;