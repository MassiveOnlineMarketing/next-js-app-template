import { GoogleSearchCompetitor } from "@prisma/client";

import { utilityService } from "@/application/services/UtitlityService";
import { SerperApiSerpResult } from "@/domain/models/serperApi";


export class GoogleSearchCompetitorResult {
  id: string;
  googleSearchCompetitorId: string;
  keywordId: string;
  position: number | null;
  url: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  googleSearchCampaignId: string;
  createdAt: Date;

  constructor(
    id: string,
    googleSearchCompetitorId: string,
    keywordId: string,
    position: number | null,
    url: string | null,
    metaTitle: string | null,
    metaDescription: string | null,
    googleSearchCampaignId: string,
    createdAt: Date
  ) {
    this.id = id;
    this.googleSearchCompetitorId = googleSearchCompetitorId;
    this.keywordId = keywordId;
    this.position = position;
    this.url = url;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.googleSearchCampaignId = googleSearchCampaignId;
    this.createdAt = new Date();
  }

/**
 * Creates a GoogleSearchCompetitorResult object from a SerperApiSerpResult.
 * @param serperApiSerpResult - The SerperApiSerpResult object.
 * @param competitor - The GoogleSearchCompetitor object.
 * @param keywordId - The keyword ID.
 * @returns A new GoogleSearchCompetitorResult object.
 */
  static fromSerperApiSerpResult(
    serperApiSerpResult: SerperApiSerpResult,
    competitor: GoogleSearchCompetitor,
    keywordId: string
  ) {
    const UtilityService = new utilityService();
    return {
        id: UtilityService.genereateUUID(),
        googleSearchCompetitorId: competitor.id,
        keywordId: keywordId,
        position: serperApiSerpResult.position,
        url: serperApiSerpResult.link,
        metaTitle: serperApiSerpResult.title,
        metaDescription: serperApiSerpResult.snippet,
        googleSearchCampaignId: competitor.googleSearchCampaignId,
        createdAt: new Date(),
    }
  }

/**
 * Creates a GoogleSearchCompetitorResult object from the SERP API response without SERP result.
 * @param competitor - The GoogleSearchCompetitor object.
 * @param keywordId - The ID of the keyword.
 * @returns A GoogleSearchCompetitorResult object.
 */
  static fromSerperApiNoSerpResult(
    competitor: GoogleSearchCompetitor,
    keywordId: string
  ) {
    const UtilityService = new utilityService();
    return {
        id: UtilityService.genereateUUID(),
        googleSearchCompetitorId: competitor.id,
        keywordId: keywordId,
        position: null,
        url: null,
        metaTitle: null,
        metaDescription: null,
        googleSearchCampaignId: competitor.googleSearchCampaignId,
        createdAt: new Date(),
    }
  }
}
