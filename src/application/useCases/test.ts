'use server';

// Keywords
import { Keyword } from "@/domain/serpTracker/enitities/Keyword";
import keywordRepository from "@/infrastructure/repositories/KeywordRepository";

// Google Ads Metrics
import { GoogleAdsApiService } from "../services/GoogleAdsApiService";
import googleAdsApiRepository from "@/infrastructure/repositories/GoogleAdsApiRepository";
import googleAdsKeywordMetrics from "@/infrastructure/repositories/GoogleAdsKeywordMetrics";

// Serp Results
import { SerperApiService } from "../services/SerperApiService";
import serperApiRepository from "@/infrastructure/repositories/SerperApiRepository";
import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

// User
import userRepository from "@/infrastructure/repositories/UserRepository";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

type TestUseCaseProps = {
  projectId: string;
  keywordNames: string[];
  country: string;
  language: string;
  domainUrl: string;
  userId: string;
}

export async function testUseCase({ projectId, keywordNames, country, language, domainUrl, userId }: TestUseCaseProps) {
  const keywords = Keyword.generateAndFormatKeywords(projectId, keywordNames);
  const res = await keywordRepository.createBulk(keywords);
  if (!res) {
    throw new Error('Failed to create keywords');
  }

  //* Google Ads Metrics
  // const googleAdsApiService = new GoogleAdsApiService(googleAdsApiRepository, googleAdsKeywordMetrics);
  // googleAdsApiService.handleKeywordsForGoogleAdsApi(keywords, country, language);

  //* Serp Results
  const serperApiService = new SerperApiService(serperApiRepository, googleSearchSerpResultRepository );
  const successfullInserts = await serperApiService.handleGoogleSearchResults(keywords, language, country, domainUrl, userId, projectId);

  if (!successfullInserts) {
    throw new Error('Failed to insert results');
  }

  // TODO: get the latestResultWithTags from the database
  const latestResults = await googleSearchSerpResultRepository.getLatestResults(successfullInserts.userResultKeywordIds);

  const responseResults = GoogleSearchLatestKeywordResult.fromDbQuery(latestResults);

  const decrementUserCredits = await userRepository.decrementUserCredits(userId, successfullInserts.successfullUserInserts);
  if (!decrementUserCredits) {
    throw new Error('Failed to decrement user credits');
  }
  

  return {success: true, data: responseResults};
}