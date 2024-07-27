import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

import { SerperApiResult } from "../enitities/SerperApiResult";
import { SerperApiUserResult } from "../enitities/SerperApiUserResult";

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any;
type GetLatestResultsReturnType = AsyncReturnType<typeof googleSearchSerpResultRepository.getLatestResults>;

export interface IGoogleSearchSerpResultRepository {
  insertSerpResults(data: SerperApiResult[]): Promise<boolean>;
  insertUserResults(userResultData: SerperApiUserResult[]): Promise<number>;
  getLatestResults(keywordIds: string[]) : Promise<GetLatestResultsReturnType>;
}