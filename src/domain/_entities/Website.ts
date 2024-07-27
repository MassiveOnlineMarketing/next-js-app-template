
import { CreateWebsiteDto, UpdateWebsiteDto } from "@/application/dto/WebsiteDto";
import { User } from "@prisma/client";


interface WebsiteConstructorParams {
  id?: string;
  userId: string;
  websiteName: string;
  domainUrl: string;
  gscUrl?: string;
}

export class Website {
  id: string;
  userId: string;
  websiteName: string;
  domainUrl: string;
  gscUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Represents a Website entity.
   */
  constructor(params: WebsiteConstructorParams | CreateWebsiteDto | UpdateWebsiteDto, userId?: string) {
    const isDto = !('userId' in params);
    if (isDto && !userId) {
      throw new Error("User must be provided when creating a website with CreateWebsiteDto or UpdateWebsiteDto");
    }
    console.log('Website constructor params:', params);
    this.id = 'id' in params && params.id ? params.id : generateUUID();
    this.userId = isDto ? userId! : params.userId;
    this.websiteName = params.websiteName;
    this.domainUrl = params.domainUrl;
    this.gscUrl = 'gscUrl' in params ? params.gscUrl : null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    // Initialize other properties and validate as necessary
  }
  
}

export function generateUUID() {
  // Returns a string containing a randomly generated UUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}