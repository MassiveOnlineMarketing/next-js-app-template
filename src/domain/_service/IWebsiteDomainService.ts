// IWebsiteDomainService.ts
export interface IWebsiteDomainService {
  verifyDomainAvailability(domain: string): Promise<boolean>;
}
