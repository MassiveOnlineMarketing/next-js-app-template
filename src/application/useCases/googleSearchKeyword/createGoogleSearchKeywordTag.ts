'use server';

import { auth } from "@/application/services/AuthService";

import { GoogleSearchKeywordService } from "@/application/services/GoogleSearchKeywordService";
import googleSearchKeywordRepository from "@/infrastructure/repositories/GoogleSearchKeywordRepository";

import { SimpleError } from "@/domain/errors/simpleErrors";

/**
 * Use case that creates a Google search keyword tag with the specified tag name and keyword IDs.
 * 
 * @param tagName - The name of the tag.
 * @param keywordIds - The ID(s) of the keyword(s) to associate with the tag.
 * @returns An object indicating the success status and the result data or error message.
 */
export async function createGoogleSearchKeywordTag(tagName: string, keywordIds: string | string[]) {
  const session = await auth();
  if (!session?.user.id) {
    return { success: false, error: 'User not authenticated or session expired' };
  }

  const googleSearchKeywordService = new GoogleSearchKeywordService(googleSearchKeywordRepository);

  try {
    const res = await googleSearchKeywordService.createTagWithKeywords(tagName, keywordIds);
    if (!res) {
      return { success: false, error: 'Failed to create tag' };
    }
    return { success: true, data: res };
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error(`Error creating tag for user: ${session.user.id}, ${error}`);
      return { success: false, error: error.message };
    }
    console.error('createGoogleSearchKeywordTag',error);
    return { success: false, error: 'Something happend please try again later' };
  }
}