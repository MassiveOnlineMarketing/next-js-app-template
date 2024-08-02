import { SimpleError } from "@/domain/errors/simpleErrors";
import { GoogleSearchKeywordTag } from "@/domain/serpTracker/enitities/GoogleSearchKeywordTag";
import { IGoogleSearchKeywordRepository } from "@/domain/serpTracker/repository/IGoogleSearchKeywordRepository";


export class GoogleSearchKeywordService{
  private googleSearchKeywordRepository: IGoogleSearchKeywordRepository;

  constructor (
    googleSearchKeywordRepository: IGoogleSearchKeywordRepository
  ){
    this.googleSearchKeywordRepository = googleSearchKeywordRepository;
  }

  /**
   * Deletes multiple keywords from the Google Search Keyword Service.
   * 
   * @param keywordIds - An array of string representing the IDs of the keywords to be deleted.
   * @returns A promise that resolves when the keywords are successfully deleted.
   */
  async deleteKeywordsByIds(keywordIds: string[]){
    return this.googleSearchKeywordRepository.deleteBulkById(keywordIds);
  }
  
  /**
   * Creates a tag with the specified keywords.
   * If the tag already exists, it adds the tag to the existing keywords.
   * If the tag does not exist, it creates a new tag and associates it with the specified keywords.
   *
   * @param {string} tag - The name of the tag.
   * @param {string | string[]} keywordIds - The ID(s) of the keywords to associate with the tag.
   * @returns {Promise<object>} - A promise that resolves to the created or existing tag.
   * @throws {SimpleError} - If the tag creation fails.
   */
  async createTagWithKeywords(tag: string, keywordIds: string | string[]){
    const keywordIdsArray = Array.isArray(keywordIds) ? keywordIds : [keywordIds];

    const existingTag = await this.googleSearchKeywordRepository.getTagByName(tag);
    if (existingTag) {
      await this.googleSearchKeywordRepository.addTagToKeywords(existingTag.id, keywordIdsArray);
      return existingTag;
    }

    const newTag = GoogleSearchKeywordTag.generateNewTag(tag);
    const res = await this.googleSearchKeywordRepository.createTag(newTag, keywordIdsArray);
    if (!res) {
      throw new SimpleError(500, 'Failed to create tag');
    }

    return newTag.toPlainObject();
  }

  /**
   * Adds a tag to a keyword or multiple keywords.
   * @param tag - The name of the tag to be added.
   * @param keywordId - The ID of the keyword or an array of keyword IDs.
   * @returns A Promise that resolves to an array of keyword objects.
   * @throws {SimpleError} - if the tag is not found.
   */
  async addTagToKeyword(tag: string, keywordId: string | string[]){
    const existingTag = await this.googleSearchKeywordRepository.getTagByName(tag);
    if (!existingTag) {
      throw new SimpleError(404, 'Tag not found');
    }

    const keywordIds = Array.isArray(keywordId) ? keywordId : [keywordId];

    // Returns a array with keyword objects
    return this.googleSearchKeywordRepository.addTagToKeywords(existingTag.id, keywordIds);
  }

  /**
   * Deletes a tag from a keyword or multiple keywords.
   * @param {string} tag - The name of the tag to be deleted.
   * @param {string | string[]} keywordId - The ID of the keyword or an array of keyword IDs.
   * @returns {Promise<void>} - A promise that resolves when the tag is successfully deleted from the keyword(s).
   * @throws {SimpleError} - If the tag is not found.
   */
  async deleteTagFromKeyword(tag: string, keywordId: string | string[]){
    const existingTag = await this.googleSearchKeywordRepository.getTagByName(tag);
    if (!existingTag) {
      throw new SimpleError(404, 'Tag not found');
    }

    const keywordIds = Array.isArray(keywordId) ? keywordId : [keywordId];

    return this.googleSearchKeywordRepository.deleteTagFromKeywords(existingTag.id, keywordIds);
  }

}