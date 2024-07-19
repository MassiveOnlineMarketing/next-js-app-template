import { SerpResult, UserSerpResult } from "@/domain/models/serpResult";
import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any;
type GetLatestResultsReturnType = AsyncReturnType<typeof googleSearchSerpResultRepository.getLatestResults>;

export interface IGoogleSearchSerpResultRepository {
  insertSerpResults(data: SerpResult[]): Promise<boolean>;
  insertUserResults(userResultData: UserSerpResult[]): Promise<number>;
  getLatestResults(keywordIds: string[]) : Promise<GetLatestResultsReturnType>;
}