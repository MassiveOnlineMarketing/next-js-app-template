import { JsonValue } from "@prisma/client/runtime/library";
import { utilityService } from "@/application/services/UtitlityService";

import {
  SerpApiPeopleAsloAsk,
  SerpApiRelatedSearches,
  SerperApiSerpResult,
  SiteLinks,
  SuccessfulSerpApiFetches,
} from "@/domain/models/serperApi";

/**
 * Represents a Google search user result.
 */
export class GoogleSearchApiUserResult {
  id: string;
  keywordId: string;
  keywordName: string;
  position: number | null;
  url: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  firstPosition: number | null;
  bestPosition: number | null;
  latestChange: number | null;
  createdAt: Date;

  relatedSearches: SerpApiRelatedSearches[] | null | JsonValue;
  peopleAlsoAsk: SerpApiPeopleAsloAsk[] | null | JsonValue;
  sitelinks: SiteLinks[] | null | JsonValue;

  constructor(
    id: string,
    keywordId: string,
    keywordName: string,
    position: number | null,
    url: string | null,
    metaTitle: string | null,
    metaDescription: string | null,
    firstPosition: number | null,
    bestPosition: number | null,
    latestChange: number | null,
    createdAt: Date,
    relatedSearches: SerpApiRelatedSearches[] | null | JsonValue,
    peopleAlsoAsk: SerpApiPeopleAsloAsk[] | null | JsonValue,
    sitelinks: SiteLinks[] | null | JsonValue
  ) {
    this.id = id;
    this.keywordId = keywordId;
    this.keywordName = keywordName;
    this.position = position;
    this.url = url;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.firstPosition = firstPosition;
    this.bestPosition = bestPosition;
    this.latestChange = latestChange;
    this.createdAt = createdAt;
    this.relatedSearches = relatedSearches;
    this.peopleAlsoAsk = peopleAlsoAsk;
    this.sitelinks = sitelinks;
  }

  /**
   * Converts a SerperApiSerpResult object to a GoogleSearchApiUserResult object.
   * @param serperApiSerpResult - The SuccessfulSerpApiFetches object containing search parameters.
   * @param userResult - The SerperApiSerpResult object to convert.
   * @returns The converted GoogleSearchApiUserResult object.
   */
  static fromSerperApiSerpResult(
    serperApiSerpResult: SuccessfulSerpApiFetches,
    userResult: SerperApiSerpResult,
  ) {
    const UtilityService = new utilityService();

    return {
      id: UtilityService.genereateUUID(),
      keywordId: serperApiSerpResult.searchParameters.keywordId,
      keywordName: serperApiSerpResult.searchParameters.q,
      position: userResult?.position || null,
      url: userResult?.link || null,
      metaTitle: userResult?.title || null,
      metaDescription: userResult?.snippet || null,
      firstPosition: userResult?.position || null,
      bestPosition: userResult?.position  || null,
      latestChange: null,
      createdAt: new Date(),
      relatedSearches: serperApiSerpResult?.relatedSearches || null,
      peopleAlsoAsk: serperApiSerpResult?.peopleAlsoAsk || null,
      sitelinks: userResult?.sitelinks || null,
    };
  }
}
