
import { SuccessfulSerpApiFetches } from "@/domain/models/serperApi";
import { TKeyword } from "../enitities/Keyword";

export interface ISerperApiRepository {
  fetchResults(keywords: TKeyword[], language: string, country: string, domainUrl: string, userId: string, projectId: string ): Promise<SuccessfulSerpApiFetches[]>;
}