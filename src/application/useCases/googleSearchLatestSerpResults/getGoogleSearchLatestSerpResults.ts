'use server';

import { AuthService } from "@/application/services/AuthService";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import googleSearchSerpResultRepository from "@/infrastructure/repositories/GoogleSearchSerpResultRepository";

export async function getGoogleSearchLatestSerpResults(campaignId: string) {
    console.log('getGoogleSearchLatestSerpResults');
    const authService = new AuthService()

    const user = await authService.currentUser()
    if (!user) {
        return { success: false, error: 'User not found' }
    }

    try {
        const latestResultsDbResponse = await googleSearchSerpResultRepository.getLatestResultsByCampaignId(campaignId);
    
        if (latestResultsDbResponse?.userId !== user.id) {
            return { success: false, error: 'User not authorized' }
        }
    
        const latestResultsDto = GoogleSearchLatestKeywordResult.fromDbQueryByCampaignId(latestResultsDbResponse);
    
        return { success: true, data: latestResultsDto };
    } catch (error) {
        console.error('Error getting latest serp results', error);
        return { success: false, error: 'Error getting latest serp results' };
    }
}