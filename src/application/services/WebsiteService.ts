import { IWebsiteRepository } from "@/domain/_repository/IWebsiteRepository";
import { CreateWebsiteDto } from "../dto/WebsiteDto";
import { Website } from "@/domain/_entities/Website";
import { AuthService } from "./AuthService";
import { IWebsiteDomainService } from "@/domain/_service/IWebsiteDomainService";


export class WebsiteService {
  constructor(
    private websiteRepository: IWebsiteRepository,
    private websiteDomainService: IWebsiteDomainService
  ) {}

  async createWebsite(websiteDto: CreateWebsiteDto): Promise<Website> {
    const session = AuthService.session()
    const isAuthorized = AuthService.isAuthenticated(session)

    if (!isAuthorized) {
      throw new Error('Unauthorized')
    }

    // Validate the session and user permissions

    // Validate business rules and invariants, this can be done in the domain service layer
    // For example, check if the website name is unique, etc.
    const isDomainAvailable = await this.websiteDomainService.verifyDomainAvailability(websiteDto.domainUrl)
    if (!isDomainAvailable) {
      throw new Error('Domain is not available')
    }


    // Persist the website entity using the repository
    return this.websiteRepository.create(websiteDto, session.user.id);
  }

  async getAllWebsites(): Promise<Website[]> {
    return this.websiteRepository.getAll();
  }
}