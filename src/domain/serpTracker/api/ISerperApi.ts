
import { GoogleSearchCampaign } from "../enitities/GoogleSearchCampaign";
import { Keyword } from "../enitities/Keyword";


/**
 * Represents the interface for the SerperApiRepository.
 */
export interface ISerperApiRepository {
    /**
     * Fetches SERP (Search Engine Results Page) data for a given campaign and keyword batch.
     * 
     * @param campaign - The GoogleSearchCampaign object representing the campaign.
     * @param keywordBatch - An array of GoogleSearchKeyword objects representing the keyword batch.
     * @returns The fetched SERP data.
     */
    fetchSerpData(campaign: GoogleSearchCampaign, keywordBatch: Keyword[]): any;
}