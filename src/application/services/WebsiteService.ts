import { IWebsiteRepository } from "@/domain/_repository/IWebsiteRepository";
import { CreateWebsiteDto, UpdateWebsiteDto } from "../dto/WebsiteDto";
import { Website } from "@/domain/_entities/Website";
import { AuthService } from "./AuthService";
import { IWebsiteDomainService } from "@/domain/_service/IWebsiteDomainService";


export class WebsiteService {
  constructor(
    private websiteRepository: IWebsiteRepository,
    private websiteDomainService: IWebsiteDomainService
  ) {}

  /**
   * Creates a new website.
   * 
   * @param websiteDto - The data transfer object containing the website details.
   * @returns A promise that resolves to the created website entity.
   * @throws An error if the user is unauthorized or if the domain is not available.
   */
  async createWebsite(websiteDto: CreateWebsiteDto): Promise<Website> {

    //TODO: Validate the session and user permissions
    const session = AuthService.session()
    const isAuthorized = AuthService.isAuthenticated(session)

    if (!isAuthorized) {
      throw new Error('Unauthorized')
    }

    
    //TODO: Check if the website is already created by the user


    //TODO: Validate business rules and invariants, this can be done in the domain service layer
    // For example, check if the website name is unique, etc.
    const isDomainAvailable = await this.websiteDomainService.verifyDomainAvailability(websiteDto.domainUrl)
    if (!isDomainAvailable) {
      throw new Error('Domain is not available')
    }


    // TODO: when all the validations are passed create the website
    const website = new Website(websiteDto)

    // Persist the website entity using the repository
    return this.websiteRepository.create(website, session.user.id);
  }



  /**
   * Updates a website.
   * 
   * @param website - The website data to be updated.
   * @returns A Promise that resolves to the updated Website entity.
   * @throws Error if the user is unauthorized or if the domain is not available.
   */
  async updateWebsite(websiteDto: UpdateWebsiteDto): Promise<Website> {
    //TODO: Validate the session and user permissions
    const session = AuthService.session()
    const isAuthorized = AuthService.isAuthenticated(session)

    if (!isAuthorized) {
      throw new Error('Unauthorized')
    }


    //TODO: Validate business rules and invariants, this can be done in the domain service layer
    // For example, check if the website name is unique, etc.
    const isDomainAvailable = await this.websiteDomainService.verifyDomainAvailability(websiteDto.domainUrl)
    if (!isDomainAvailable) {
      throw new Error('Domain is not available')
    }


    //TODO: when all the validations are passed create the website
    const website = new Website(websiteDto);


    // Persist the website entity using the repository
    return this.websiteRepository.update(website);
  }

  async getAllWebsites(): Promise<Website[]> {
    return this.websiteRepository.getAll();
  }
}