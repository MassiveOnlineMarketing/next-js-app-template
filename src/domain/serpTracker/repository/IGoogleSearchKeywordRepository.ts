import { TKeyword } from "../enitities/GoogleSearchKeyword";
import { GoogleSearchKeywordTag } from "../models/GoogleSearchKeywordTag";

/**
 * Represents a repository for managing Google search keywords.
 */
export interface IGoogleSearchKeywordRepository {
  /**
   * Creates multiple keywords in bulk.
   * @param keywords - The array of keywords to create.
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  createBulk(keywords: TKeyword[]): Promise<boolean>;

  /**
   * Deletes multiple keywords in bulk.
   * @param keywordIds - The IDs of the keywords to delete.
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  deleteBulkById(keywordIds: string[]): Promise<boolean>;

  /**
   * Retrieves a keyword tag by its name.
   * @param tag - The name of the tag to retrieve.
   * @returns A promise that resolves to the retrieved tag or null if not found.
   */
  getTagByName(tag: string): Promise<GoogleSearchKeywordTag | null>;

  /**
   * Creates a new tag and associates it with the specified keyword IDs.
   * @param tag - The tag to create.
   * @param keywordIds - The IDs of the keywords to associate with the tag.
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  createTag(tag: GoogleSearchKeywordTag, keywordIds: string[]): Promise<boolean>;

  /**
   * Adds a tag to multiple keywords.
   * @param tagId - The name of the tag to add.
   * @param keywordIds - The IDs of the keywords to add the tag to.
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  addTagToKeywords(tagId: string, keywordIds: string[]): Promise<test>;

  /**
   * Deletes a tag from multiple keywords.
   * @param tagId - The ID of the tag to delete.
   * @param keywordId - The ID of the keyword to remove the tag from.
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  deleteTagFromKeywords(tagId: string, keywordId: string[]): Promise<boolean>;
}

type test ={
  id: string;
  googleSearchCampaignId: string;
  keyword: string;
  createdAt: Date;
}[][]