import { SimpleError } from "@/domain/errors/simpleErrors";

import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import { SerpApiService } from "@/application/services/GoogleSerpApiService";
import { SerperApiService } from "@/application/services/SerperApiService";

import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";
import { GoogleAdsApiService } from "@/application/services/GoogleAdsApiService";

import googleAdsApi from "@/infrastructure/api/GoogleAdsApi";
import googleAdsKeywordMetricsRepository from "@/infrastructure/repositories/GoogleAdsKeywordMetricsRepository";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

type Data = {
  campaignId: string;
  keywordNames: string[];
};

export async function POST(req: Request) {
  const data: Data = await req.json();
  const { campaignId, keywordNames } = data;
  if (!campaignId || !keywordNames) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid data" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const session = await auth();
  if (!session) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const serpApiService = new SerpApiService(
    new AuthService(),
    new GoogleSearchCampaignService(googleSearchCampaignRepository, new AuthService()),
    new SerperApiService(),
    new GoogleAdsApiService(googleAdsApi, googleAdsKeywordMetricsRepository)
  );

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  try {

    const BATCH_SIZE = 99;
    
    const batchPromises = [];
    
    for (let i = 0; i < keywordNames.length; i += BATCH_SIZE) {
      const batch = keywordNames.slice(i, i + BATCH_SIZE);
      const batchData = {
        campaignId,
        keywordNames: batch,
      };
    
      // Create a promise that includes the delay and the API request
      const batchPromise = delay(i / BATCH_SIZE * 1000).then(() => serpApiService.handleApiRequest(batchData));
      batchPromises.push(batchPromise);
    }
    
    const allResults = await Promise.all(batchPromises);
    
    // Flatten the array of arrays into a single array
    const resultsToReturn = allResults.flat();

    return new Response(
      JSON.stringify({ success: true, data: JSON.stringify(resultsToReturn)}),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    if (error instanceof SimpleError) {
      console.error("Error processing keywords", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    console.error("Error processing keywords api route", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error processing keywords" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
