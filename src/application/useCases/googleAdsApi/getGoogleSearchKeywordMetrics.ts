'use server';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

import { auth, AuthService } from "@/application/services/AuthService";

import { GoogleAdsApiService } from "@/application/services/GoogleAdsApiService";
import googleAdsApi from "@/infrastructure/api/GoogleAdsApi";
import googleAdsKeywordMetricsRepository from "@/infrastructure/repositories/GoogleAdsKeywordMetricsRepository";
import { KeywordMetrics } from "@/domain/models/historicalMetrics";

export type KeywordMetricsApiResponse = {
  keyword_metrics: KeywordMetrics
  text: string
}

export async function getGoogleSearchKeywordMetrics(keywords: string[], campaign: GoogleSearchCampaign | null) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  if (!keywords) {
    return { success: false, error: 'No keywords provided' };
  }

  if (!keywords.length) {
    return { success: false, error: 'No keywords provided' };
  }

  const authService = new AuthService();
  const currentUser = await authService.currentUser();

  if (!currentUser) {
    return { success: false, error: 'No user found' };
  }

  if (!campaign) {
    return { success: false, error: 'No campaign provided' };
  }


  if (campaign.userId !== currentUser.id) {
    return { success: false, error: 'User does not have access to this campaign' };
  }


  const googleAdsApiService = new GoogleAdsApiService(googleAdsApi, googleAdsKeywordMetricsRepository);

  try {
    const keywordMetrics: KeywordMetricsApiResponse[] = await googleAdsApiService.getKeywordMetrics(keywords, campaign.locationCode, campaign.languageCode);
    return { success: true, data: keywordMetrics };
    
  } catch (error) {
    return { success: false, error: 'Failed to get keyword metrics' };
  }
}