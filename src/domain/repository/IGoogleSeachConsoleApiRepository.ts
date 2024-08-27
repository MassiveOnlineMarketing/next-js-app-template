import { PythonApiSite } from "@/infrastructure/repositories/GoogleSeachConsoleApiRepository";
import { GoogleSearchConsoleKeywordDetailsData } from "../models/googleSearchConsoleApi";

/**
 * Represents a repository for interacting with the Google Search Console API.
 */
export interface IGoogleSearchConsoleApiRepository {
  /**
   * Retrieves the connected sites for a given refresh token.
   * @param refreshToken - The refresh token used for authentication.
   * @returns A promise that resolves to an array of PythonApiSite objects or null.
   */
  getConnectedSites(refreshToken: string): Promise<PythonApiSite[] | null>;

  getKeywordDetailsData(keywordName: string, gscUrl: string, refresh_token: string, countryCode: string): Promise<GoogleSearchConsoleKeywordDetailsData | null>

  getTopPerformingKeywordsByCountry(amountOfKeywords: number, gscUrl: string, refresh_token: string, countryCode: string): Promise<any | null>
}