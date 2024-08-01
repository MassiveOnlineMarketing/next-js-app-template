'use server';

import { auth } from "@/application/services/AuthService";

import { GoogleSearchKeywordService } from "@/application/services/GoogleSearchKeywordService";
import googleSearchKeywordRepository from "@/infrastructure/repositories/GoogleSearchKeywordRepository";

import { SimpleError } from "@/domain/errors/simpleErrors";

/**
 * Use case that deletes a Google search tag from keywords.
 * 
 * @param tagName - The name of the tag to delete.
 * @param keywordIds - The ID(s) of the keywords to remove the tag from.
 * @returns A promise that resolves to an object with the success status and data, or an error message.
 */
export async function deleteGoogleSearchTagFromKeywords(tagName: string, keywordIds: string | string[]) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchKeywordService = new GoogleSearchKeywordService(googleSearchKeywordRepository);

  try {
    const res = await googleSearchKeywordService.deleteTagFromKeyword(tagName, keywordIds);

    if (!res) {
      return { success: false, error: 'Failed to delete tag from keyword' };
    }

    return { success: true, data: res };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error deleting tag for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('deleteGoogleSearchTagFromKeywords',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}