import { utilityService } from "@/application/services/UtitlityService";

export type TKeyword ={
  id: string;
  keyword: string;
  googleSearchCampaignId: string;
  createdAt: Date;
}

export class Keyword {
  id: string;
  keyword: string;
  googleSearchCampaignId: string;
  createdAt: Date;

  constructor(
    id: string,
    keyword: string,
    googleSearchCampaignId: string,
    createdAt?: Date,
  ){
    this.id = id;
    this.keyword = keyword;
    this.googleSearchCampaignId = googleSearchCampaignId;
    this.createdAt = createdAt || new Date();
  }

  static createAsPlainObject(
    id: string,
    keyword: string,
    googleSearchCampaignId: string,
    createdAt?: Date,
  ) {
    const keywordInstance = new Keyword(id, keyword, googleSearchCampaignId, createdAt);
    return keywordInstance.toPlainObject();
  }

  /**
   * Generates and formats keywords based on the provided project ID and keyword names.
   * @param projectId - The ID of the project.
   * @param keywordNames - An array of keyword names.
   * @returns An array of formatted keywords.
   */
  static generateAndFormatKeywords(projectId: string, keywordNames: string[]) {
    const UtilityService = new utilityService();
    const keywords = keywordNames.map(keywordName => 
      Keyword.createAsPlainObject(
        UtilityService.genereateUUID(),
        keywordName.toLowerCase(),
        projectId,
        new Date()
      )
    );

    return keywords;
  }

  toPlainObject() {
    return {
      id: this.id,
      keyword: this.keyword,
      googleSearchCampaignId: this.googleSearchCampaignId,
      createdAt: this.createdAt,
    };
  }
}