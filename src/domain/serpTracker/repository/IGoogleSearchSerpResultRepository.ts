import { SerperApiResult } from "../enitities/SerperApiResult";
import { GoogleSearchCompetitorResult } from "../enitities/GoogleSearchCompetitorResult";
import { GoogleSearchApiUserResult } from "../enitities/GoogleSearchApiUserResult";

import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any;
export type GetLatestResultsReturnType = AsyncReturnType<typeof googleSearchSerpResultRepository.getLatestResults>;
export type GetLatestResultsByCampaignIdReturnType = AsyncReturnType<typeof googleSearchSerpResultRepository.getLatestResultsByCampaignId>;

export interface IGoogleSearchSerpResultRepository {
  insertSerpResults(data: SerperApiResult[]): Promise<boolean>;
  insertUserResults(userResultData: GoogleSearchApiUserResult[]): Promise<boolean>;
  insertCompetitorResults(data: GoogleSearchCompetitorResult[]): Promise<boolean>;
  getLatestResults(keywordIds: string[]) : Promise<GetLatestResultsReturnType>;
  getLatestResultsByCampaignId(campaignId: string): Promise<GetLatestResultsByCampaignIdReturnType>;
}