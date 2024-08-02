'use server';

import { auth } from "@/application/services/AuthService";
import { GoogleSearchKeywordService } from "@/application/services/GoogleSearchKeywordService";
import googleSearchKeywordRepository from "@/infrastructure/repositories/GoogleSearchKeywordRepository";


export async function deleteGoogleSearchKeywordByIds(keywordId: string[]) {

  const session = await auth();
  if (!session?.user) {
    return { success: false, message: 'No user found' };
  }

  const googleSearchKeywordService = new GoogleSearchKeywordService(googleSearchKeywordRepository);

  try {
    const res = await googleSearchKeywordService.deleteKeywordsByIds(keywordId);
    return res ? { success: true } : { success: false, message: 'Failed to delete keyword' };
  } catch (error) {
    console.error('error creating keyword:', error);
    return { success: false, message: 'Error creating keyword' };
  }
}