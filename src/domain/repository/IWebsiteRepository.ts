import { CreateWebsiteDto, UpdateWebsiteDto } from "@/application/dto/WebsiteDto";
import { Website } from "../_entities/Website";

/**
 * Represents a repository for managing website entities.
 */
export interface IWebsiteRepository {
  /**
   * Creates a new website entity.
   * @param website - The website data to create.
   * @param userId - The ID of the user associated with the website.
   * @returns A promise that resolves with the created website entity.
   */
  create(website: Website, userId: string): Promise<Website>;

  /**
   * Updates an existing website entity.
   * @param website - The website data to update.
   * @returns A promise that resolves with the updated website entity.
   */
  update(website: Website): Promise<Website>;

  /**
   * Retrieves all website entities.
   * @returns A promise that resolves with an array of website entities.
   */
  getAll(): Promise<Website[]>;

  /**
   * Retrieves all website entities associated with a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves with an array of website entities.
   */
  getByUserId(userId: string): Promise<Website[]>;
}