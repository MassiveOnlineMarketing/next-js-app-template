import { utilityService } from "@/application/services/UtitlityService";
import { SerperApiSerpResult } from "@/domain/models/serperApi";




export class SerperApiResult {
  id: string;
  keywordId: string;
  position: number;
  url: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;

  /**
   * Represents a SerperApiResults entity.
   */
  constructor(
    id: string,
    keywordId: string,
    position: number,
    url: string,
    metaTitle: string,
    metaDescription: string,
    createdAt: Date
  ) {
    this.id = id;
    this.keywordId = keywordId;
    this.position = position;
    this.url = url;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.createdAt = new Date();
  }

  /**
   * Creates a new instance of SerperApiResult based on the provided SerperApiSerpResult and keywordId.
   * @param serperApiSerpResult - The SerperApiSerpResult object.
   * @param keywordId - The keyword ID.
   * @returns A new instance of SerperApiResult.
   */
  static fromSerperApiSerpResult(
    serperApiSerpResult: SerperApiSerpResult,
    keywordId: string
  ) {
    const UtilityService = new utilityService();
    return {
      id: UtilityService.genereateUUID(),
      keywordId: keywordId,
      position: serperApiSerpResult.position,
      url: serperApiSerpResult.link,
      metaTitle: serperApiSerpResult.title,
      metaDescription: serperApiSerpResult.snippet,
      createdAt: new Date(),
    };
  }
}
