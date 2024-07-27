import { PythonApiSite } from "@/infrastructure/repositories/GoogleSeachConsoleApiRepository";

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
}