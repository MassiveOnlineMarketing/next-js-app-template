// Import interfaces and entities
import { IGoogleSearchCampaignRepository } from '@/domain/serpTracker/repository/IGoogleSearchCampaignRepository';
import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign';
import { db } from '../db/prisma';
import { CreateGoogleSearchCampaignDto, UpdateGoogleSearchCampaignDto } from '@/application/dto/GoogleSearchCampaignDto';
// Import the database model
// import { GoogleSearchConsoleModel } from '../db/models/GoogleSearchConsoleModel';

class GoogleSearchCampaignRepository implements IGoogleSearchCampaignRepository {

  create(campaign: CreateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
    const newCampaign = db.googleSearchProject.create({
      data: {
        domainUrl: campaign.domainUrl,
        websiteId: campaign.websiteId,
        userId: campaign.userId,
        projectName: campaign.projectName,
        // isMobile: campaign.isMobile,  
        country: campaign.country,
        language: campaign.language,
        gscUrl: campaign.gscSite || null,
        competitor: {
          createMany: {
            data: campaign.competitors?.map(competitor => {
              return { domainUrl: competitor }
            }) ?? []
          }

        }
      }
    })

    return newCampaign;
  }

  update(id: string, campaign: UpdateGoogleSearchCampaignDto): Promise<GoogleSearchCampaign> {
    const updatedCampaign = db.googleSearchProject.update({
      where: { id: id },
      data: {
        projectName: campaign.projectName,
        // isMobile: campaign.isMobile,  
        country: campaign.country,
        competitor: {
          createMany: {
            data: campaign.competitors?.map(competitor => {
              return { domainUrl: competitor }
            }) ?? []
          }
        }
      }
    })

    return updatedCampaign;
  }

  delete(id: string): Promise<boolean> {
    const deletedCampaign = db.googleSearchProject.delete({
      where: { id: id }
    })

    return deletedCampaign.then(() => true);
  }

  getById(id: string): Promise<GoogleSearchCampaign | null> {
    const campaign = db.googleSearchProject.findUnique({
      where: { id: id }
    })

    return campaign;
  }

  getByUserId(id: string): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchProject.findMany({
      where: { userId: id }
    });

    return campaigns;
  }

  getByWebsiteId(id: string): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchProject.findMany({
      where: { websiteId: id }
    });

    return campaigns
  }

  getAll(): Promise<GoogleSearchCampaign[]> {
    const campaigns = db.googleSearchProject.findMany();

    return campaigns;
  }

  deleteCompetitors(campaignId: string, competitors: string[]): Promise<boolean> {
    const deletedCompetitors = db.googleSearchCompetitor.deleteMany({
      where: {
        googleSearchProjectId: campaignId,
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
        googleSearchProjectId: campaignId
      }
    })

    return competitors;
  }
}

// Assign the instance to a variable
const googleSearchCampaignRepository = new GoogleSearchCampaignRepository();

// Export the instance
export default googleSearchCampaignRepository;