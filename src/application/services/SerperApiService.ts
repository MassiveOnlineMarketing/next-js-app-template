import { GoogleSearchCompetitor } from "@prisma/client";
import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";
import { GoogleSearchCompetitorResult } from "@/domain/serpTracker/enitities/GoogleSearchCompetitorResult";
import { SerperApiResult } from "@/domain/serpTracker/enitities/SerperApiResult";
import { GoogleSearchApiUserResult } from "@/domain/serpTracker/enitities/GoogleSearchApiUserResult";

import googleSearchSerpResultRepository from "../../infrastructure/repositories/GoogleSearchSerpResultRepository";


/**
 * Service class for handling SERP API results.
 */
export class SerperApiService {
  /**
   * Handles competitor results by inserting them into the database.
   * If a competitor result is found, it is inserted with the SERP result.
   * If no competitor result is found, it is inserted without the SERP result.
   *
   * @param serperApiResults The SERP API results.
   * @param competitors The list of competitors.
   */
  async handleCompetitorResults(
    serperApiResults: SuccessfulSerpApiFetches[],
    competitors: GoogleSearchCompetitor[]
  ) {
    const competitorResultsToInsert: GoogleSearchCompetitorResult[] = [];

    for (const competitor of competitors) {
      for (const result of serperApiResults) {
        const competitorResult = result.organic.filter((item) =>
          item.link.includes(competitor.domainUrl)
        );
        const keywordId = result.searchParameters.keywordId;

        // if no result is found, insert a competitor result with no serp result
        if (competitorResult.length === 0) {
          competitorResultsToInsert.push(
            GoogleSearchCompetitorResult.fromSerperApiNoSerpResult(
              competitor,
              keywordId
            )
          );
        } else {
          // if a result is found, insert a competitor result with serp result
          competitorResultsToInsert.push(
            GoogleSearchCompetitorResult.fromSerperApiSerpResult(
              competitorResult[0],
              competitor,
              keywordId
            )
          );
        }
      }
    }

    const res = await googleSearchSerpResultRepository.insertCompetitorResults(
      competitorResultsToInsert
    );

    if (res) {
      console.log("🟢 Successfully inserted Competitor results");
    } else {
      console.log("🔴 Failed to insert Competitor results");
    }
  }

  /**
   * Handles top ten results by inserting them into the database.
   *
   * @param serperApiResults The SERP API results.
   */
  async handleTopTenResults(serperApiResults: SuccessfulSerpApiFetches[]) {
    const resultsToInsert: SerperApiResult[] = [];

    for (const result of serperApiResults) {
      const keywordId = result.searchParameters.keywordId;
      for (const serpResult of result.organic.slice(0, 10)) {
        resultsToInsert.push(
          SerperApiResult.fromSerperApiSerpResult(serpResult, keywordId)
        );
      }
    }

    const res = await googleSearchSerpResultRepository.insertSerpResults(
      resultsToInsert
    );
    if (res) {
      console.log("🟢 Successfully inserted Top Ten results");
    } else {
      console.log("🔴 Failed to insert Top Ten results");
    }
  }

  /**
   * Handles user results by inserting them into the database.
   *
   * @param serperApiResults The SERP API results.
   * @param domainUrl The domain URL.
   * @returns The inserted user results.
   */
  async handleUserResults(
    serperApiResults: SuccessfulSerpApiFetches[],
    domainUrl: string
  ) {
    const resultsToInsert: GoogleSearchApiUserResult[] = [];
    for (const result of serperApiResults) {

      const userResults = result.organic.filter((item) =>
        item.link.includes(domainUrl)
      );

      resultsToInsert.push(
        GoogleSearchApiUserResult.fromSerperApiSerpResult(
          result,
          userResults[0],
        )
      );
    }

    const res = await googleSearchSerpResultRepository.insertUserResults(
      resultsToInsert
    );

    if (res) {
      console.log("🟢 Successfully inserted User results");
    } else {
      console.log("🔴 Failed to insert User results");
    }

    return resultsToInsert;
  }

}
