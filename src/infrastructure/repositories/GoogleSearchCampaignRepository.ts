import { db } from '../db/prisma';

import { IGoogleSearchCampaignRepository } from '@/domain/serpTracker/repository/IGoogleSearchCampaignRepository';
import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign';

class GoogleSearchCampaignRepository implements IGoogleSearchCampaignRepository {

  create(campaign: GoogleSearchCampaign, competitors: string[] | null): Promise<GoogleSearchCampaign> {
    const newCampaign = db.googleSearchCampaign.create({
      data: {
        ...campaign,
        competitor: {
          createMany: {
            data: competitors?.map(competitor => {
              return { domainUrl: competitor }
            }) ?? []
          }
        }
      }
    })

    return newCampaign;
  }

  update(campaign: GoogleSearchCampaign, competitors: string[] | null): Promise<GoogleSearchCampaign> {
    const updatedCampaign = db.googleSearchCampaign.update({
      where: { id: campaign.id },
      data: {
        ...campaign,
        competitor: {
          createMany: {
            data: competitors?.map(competitor => {
              return { domainUrl: competitor }
            }) ?? []
          }
        }
      }
    })

    return updatedCampaign;
  }

  delete(id: string): Promise<boolean> {
    const deletedCampaign = db.googleSearchCampaign.delete({
      where: { id: id }
    })

    return deletedCampaign.then(() => true);
  }

  getById(id: string): Promise<GoogleSearchCampaign | null> {
    const campaign = db.googleSearchCampaign.findUnique({
      where: { id: id }
    })

    return campaign;
  }

  getByUserId(id: string): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchCampaign.findMany({
      where: { userId: id }
    });

    return campaigns;
  }

  getByWebsiteId(id: string): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchCampaign.findMany({
      where: { websiteId: id }
    });

    return campaigns
  }

  getAll(): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchCampaign.findMany();

    return campaigns;
  }

  deleteCompetitors(campaignId: string, competitors: string[]): Promise<boolean> {
    const deletedCompetitors = db.googleSearchCompetitor.deleteMany({
      where: {
        googleSearchCampaignId: campaignId,
        domainUrl: {
          in: competitors
        }
      }
    })

    return deletedCompetitors.then(() => true);
  }

  getCompetitorsByCampaignId(campaignId: string): Promise<any> {
    const competitors = db.googleSearchCompetitor.findMany({
      where: {
        googleSearchCampaignId: campaignId
      }
    })

    return competitors;
  }
}

// Assign the instance to a variable
const googleSearchCampaignRepository = new GoogleSearchCampaignRepository();

// Export the instance
export default googleSearchCampaignRepository;