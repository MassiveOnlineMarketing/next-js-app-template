'use server';

import { auth } from "@/application/services/AuthService";
import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

export async function getGoogleSearchTopTenSerpResults(keywordId: string) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const topTenResults = await googleSearchSerpResultRepository.getTopTenSerpResults(keywordId);

    return { success: true, data: topTenResults };
  } catch (error) {
    console.error('getGoogleSearchTopTenSerpResults',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}