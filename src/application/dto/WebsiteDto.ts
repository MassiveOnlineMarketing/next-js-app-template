
export interface WebsiteDto {
  id: string;
  userId: string;
  websiteName: string;
  domainUrl: string;
  gscUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebsiteDto {
  websiteName: string;
  domainUrl: string;
  gscUrl?: string;
}

export interface UpdateWebsiteDto {
  id: string;
  userId: string
  websiteName: string;
  domainUrl: string;
  gscUrl?: string;
}