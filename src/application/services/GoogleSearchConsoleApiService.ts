import GoogleSearchConsoleApiRepository from "@/infrastructure/repositories/GoogleSeachConsoleApiRepository";


export class GoogleSearchConsoleApiService {
  private googleSearchConsoleApiRepository: GoogleSearchConsoleApiRepository;

  constructor() {
    this.googleSearchConsoleApiRepository = new GoogleSearchConsoleApiRepository();
  }

  /**
   * Fetches the connected sites using the provided refresh token.
   * @param refreshToken - The refresh token used to authenticate the request.
   * @returns A promise that resolves to the connected sites.
   */
  async fetchConnectedSites(refreshToken: string) {
    return this.googleSearchConsoleApiRepository.getConnectedSites(refreshToken);
  }

}