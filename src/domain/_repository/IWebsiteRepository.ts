import { CreateWebsiteDto } from "@/application/dto/WebsiteDto";
import { Website } from "../_entities/Website";

export interface IWebsiteRepository {
  create(website: CreateWebsiteDto, userId: string): Promise<Website>;
  getAll(): Promise<Website[]>;
}