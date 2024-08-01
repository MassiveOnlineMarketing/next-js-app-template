'use server';

import { auth } from "@/application/services/AuthService";

import { GoogleSearchKeywordService } from "@/application/services/GoogleSearchKeywordService";
import googleSearchKeywordRepository from "@/infrastructure/repositories/GoogleSearchKeywordRepository";

import { SimpleError } from "@/domain/errors/simpleErrors";

/**
 * Use case that adds a Google search tag to the specified keywords.
 * 
 * @param tagName - The name of the tag to add.
 * @param keywordIds - The ID(s) of the keywords to add the tag to.
 * @returns An object indicating the success status and any error message or data.
 */
export async function addGoogleSearchTagToKeywords(tagName: string, keywordIds: string | string[]) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchKeywordService = new GoogleSearchKeywordService(googleSearchKeywordRepository);

  try {
    const res = await googleSearchKeywordService.addTagToKeyword(tagName, keywordIds);

    if (!res) {
      return { success: false, error: 'Failed to add tag to keyword' };
    }

    return { success: true, data: res };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error adding tag to keyword for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('addGoogleSearchTagToKeywords',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}