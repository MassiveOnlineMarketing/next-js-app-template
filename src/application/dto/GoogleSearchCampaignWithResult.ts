import { Website } from "@/domain/_entities/Website";

export class GoogleSearchCampaignWithResult {
  id: string;
  website: Website;
  campaignName: string;
  domainUrl: string;
  language: string;
  country: string;
  improved: number;
  worsened: number;
  total: number;
  topThree: number;
  topTen: number;
  topHundred: number;
  averagePosition: number;
  createdAt: Date;

  constructor(
    id: string,
    website: Website,
    campaignName: string,
    domainUrl: string,
    language: string,
    country: string,
    improved: number,
    worsened: number,
    total: number,
    topThree: number,
    topTen: number,
    topHundred: number,
    averagePosition: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.website = website;
    this.campaignName = campaignName;
    this.domainUrl = domainUrl;
    this.language = language;
    this.country = country;
    this.improved = improved;
    this.worsened = worsened;
    this.total = total;
    this.topThree = topThree;
    this.topTen = topTen;
    this.topHundred = topHundred;
    this.averagePosition = averagePosition;
    this.createdAt = createdAt;
  }

  static fromDbQuery(campaigns: any): GoogleSearchCampaignWithResult[] {
    const formatedCampaigns = campaigns.map((campaign: any) => {

      const formatedData =  new GoogleSearchCampaignWithResult(
        campaign.id,
        campaign.website,
        campaign.campaignName,
        campaign.domainUrl,
        campaign.language,
        campaign.country,
        campaign.results[0]?.improved,
        campaign.results[0]?.worsened,
        campaign.results[0]?.total,
        campaign.results[0]?.topThree,
        campaign.results[0]?.topTen,
        campaign.results[0]?.topHundred,
        campaign.results[0]?.averagePosition,
        new Date(campaign.results[0]?.createdAt),
      );

      return { ...formatedData};
    });

    return formatedCampaigns;
  }

}