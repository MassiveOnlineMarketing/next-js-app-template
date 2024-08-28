'use server';

import { auth } from "@/application/services/AuthService";
import { GoogleSearchConsoleApiService } from "@/application/services/GoogleSearchConsoleApiService";
import { SimpleError } from "@/domain/errors/simpleErrors";

export async function fetchGoogleSearchConsoleKeywordDetailsData(keywordName: string, websiteId: string, countryCode: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  const googleSearchConsoleApiService = new GoogleSearchConsoleApiService();

  try {
    const googleSearchConsoleData = await googleSearchConsoleApiService.fetchKeywordDetailsData(keywordName, websiteId, countryCode);

    return { success: true, data: googleSearchConsoleData };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error getting keyword search console data for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('fetchGoogleSearchConsoleKeywordDetailsData',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}