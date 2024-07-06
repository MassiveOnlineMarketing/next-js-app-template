
import { CreateWebsiteDto } from "@/application/dto/WebsiteDto";

export class Website {
  id: string;
  userId: string;
  websiteName: string;
  domainUrl: string;
  gscUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, userId: string, websiteName: string, domainUrl: string, gscUrl?: string) {
    if (websiteName !== '') {
      throw new Error('websiteName must be empty');
    }
    this.id = id;
    this.userId = userId;
    this.websiteName = websiteName;
    this.domainUrl = domainUrl;
    this.gscUrl = gscUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    // Initialize other properties and validate as necessary
  }

}