import { CreateWebsiteDto, UpdateWebsiteDto } from "../dto/WebsiteDto";

import { AuthService } from "./AuthService";

import { Website } from "@/domain/_entities/Website";
import { IWebsiteRepository } from "@/domain/repository/IWebsiteRepository";
import { IWebsiteDomainService } from "@/domain/_service/IWebsiteDomainService";
import { SimpleError } from "@/domain/errors/simpleErrors";


export class WebsiteService {
  private authService: AuthService;
  private websiteRepository: IWebsiteRepository;
  private websiteDomainService: IWebsiteDomainService;

  constructor(
    authService: AuthService,
    websiteRepository: IWebsiteRepository,
    websiteDomainService: IWebsiteDomainService
  ) {
    this.authService = authService;
    this.websiteRepository = websiteRepository;
    this.websiteDomainService = websiteDomainService;
  }

  /**
   * Creates a new website.
   * 
   * @param websiteDto - The data transfer object containing the website details.
   * @returns A promise that resolves to the created website entity.
   * @throws An error if the user is unauthorized or if the domain is not available.
   */
  async createWebsite(websiteDto: CreateWebsiteDto): Promise<Website> {
    //TODO: Validate the session and user permissions
    // validate userId
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new Error('Unauthorized');
    }

    //TODO: Check if the website is already created by the user


    //TODO: Validate business rules and invariants, this can be done in the domain service layer
    // // For example, check if the website name is unique, etc.
    // const isDomainAvailable = await this.websiteDomainService.verifyDomainAvailability(websiteDto.domainUrl)
    // if (!isDomainAvailable) {
    //   throw new Error('Domain is not available')
    // }


    // TODO: when all the validations are passed create the website
    const website = new Website(websiteDto, user.id)

    // Persist the website entity using the repository
    return this.websiteRepository.create(website, user.id);
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
    // validate userId
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new Error('Unauthorized');
    }


    //TODO: Validate business rules and invariants, this can be done in the domain service layer
    // For example, check if the website name is unique, etc.
    // const isDomainAvailable = await this.websiteDomainService.verifyDomainAvailability(websiteDto.domainUrl)
    // if (!isDomainAvailable) {
    //   throw new Error('Domain is not available')
    // }


    //TODO: when all the validations are passed create the website
    const website = new Website(websiteDto);


    // Persist the website entity using the repository
    return this.websiteRepository.update(website);
  }


  async deleteWebsite(websiteId: string): Promise<boolean> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new Error('Unauthorized');
    }

    const existingWebsite = await this.websiteRepository.getById(websiteId);
    if (!existingWebsite) {
      throw new Error('Website not found');
    }

    if (existingWebsite.userId !== user.id) {
      throw new Error('Unauthorized');
    }

    return this.websiteRepository.delete(websiteId);
  }

  async getById(websiteId: string): Promise<Website> {
    const user = await this.authService.currentUser();
    if (!user?.id) {
      throw new SimpleError(401, 'Unauthorized');
    }

    const website = await this.websiteRepository.getById(websiteId);
    if (!website) {
      throw new SimpleError(404, 'Website not found');
    }
    if (website.userId !== user.id) {
      throw new SimpleError(403, 'Website does not belong to user');
    }

    return website;
  }

  async getAllWebsites(): Promise<Website[]> {

    return this.websiteRepository.getAll();
  }

  async getWebsiteByUserId(userId: string): Promise<Website[]> {
    const currentUser = await this.authService.currentUser();
    if (!currentUser?.id) {
      throw new Error('Please log in');
    }

    const websites = await this.websiteRepository.getByUserId(userId);

    return websites;
  }
}