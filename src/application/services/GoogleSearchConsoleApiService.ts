import GoogleSearchConsoleApiRepository from "@/infrastructure/repositories/GoogleSeachConsoleApiRepository";
import { AuthService } from "./AuthService";
import { SimpleError } from "@/domain/errors/simpleErrors";
import userRepository from "@/infrastructure/repositories/UserRepository";
import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";
import websiteRepository from "@/infrastructure/repositories/WebsiteRepository";


export class GoogleSearchConsoleApiService {
  private googleSearchConsoleApiRepository: GoogleSearchConsoleApiRepository;
  private authService: AuthService;

  constructor() {
    this.googleSearchConsoleApiRepository = new GoogleSearchConsoleApiRepository();
    this.authService = new AuthService();
  }

  /**
   * Fetches the connected sites using the provided refresh token.
   * @param refreshToken - The refresh token used to authenticate the request.
   * @returns A promise that resolves to the connected sites.
   */
  async fetchConnectedSites(refreshToken: string) {
    return this.googleSearchConsoleApiRepository.getConnectedSites(refreshToken);
  }

  async fetchKeywordDetailsData(keywordName: string, websiteId: string) {
    const user = await this.authService.currentUser();
    if (!user) {
      throw new SimpleError(401, 'Unauthorized');
    }
    
    const refreshToken = await this.authService.getGoogleRefreshToken();
    if (!refreshToken) {
      throw new SimpleError(404, 'Please connect your Google Search Console account');
    }

    const website = await websiteRepository.getById(websiteId);
    if (!website?.gscUrl) {
      throw new SimpleError(404, 'Please connect your Google Search Console account');
    }
    if (website.userId !== user.id) {
      throw new SimpleError(403, 'Unauthorized');
    }

    console.log

    return this.googleSearchConsoleApiRepository.getKeywordDetailsData(keywordName, website.gscUrl, refreshToken);
  }
}