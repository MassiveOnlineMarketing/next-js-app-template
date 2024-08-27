'use server';

import { auth } from "@/application/services/AuthService";
import { GoogleSearchConsoleApiService } from "@/application/services/GoogleSearchConsoleApiService";
import { SimpleError } from "@/domain/errors/simpleErrors";

export async function fetchGoogleSearchConsoleTopKeywords(amountOfKeywords: number, websiteId: string, countryCode: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const googleSearchConsoleApiService = new GoogleSearchConsoleApiService();

  try {
    const topKeywords = await googleSearchConsoleApiService.fetchTopPerformingKeywordsByCountry(amountOfKeywords, websiteId, countryCode);

    return { success: true, data: topKeywords };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error getting search console top keywords for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('fetchGoogleSearchConsoleTopKeywords',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}