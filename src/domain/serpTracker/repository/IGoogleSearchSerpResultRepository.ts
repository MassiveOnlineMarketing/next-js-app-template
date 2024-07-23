import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

import { SerpResult } from "../enitities/SerpResult";
import { SerpUserResult } from "../enitities/SerpUserResult";

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any;
type GetLatestResultsReturnType = AsyncReturnType<typeof googleSearchSerpResultRepository.getLatestResults>;

export interface IGoogleSearchSerpResultRepository {
  insertSerpResults(data: SerpResult[]): Promise<boolean>;
  insertUserResults(userResultData: SerpUserResult[]): Promise<number>;
  getLatestResults(keywordIds: string[]) : Promise<GetLatestResultsReturnType>;
}