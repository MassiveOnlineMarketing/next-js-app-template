import { SimpleError } from "@/domain/errors/simpleErrors";

import { auth, AuthService } from "@/application/services/AuthService";
import { GoogleSearchCampaignService } from "@/application/services/GoogleSearchCampaignService";
import { SerpApiService } from "@/application/services/GoogleSerpApiService";
import { SerperApiService } from "@/application/services/SerperApiService";

import googleSearchCampaignRepository from "@/infrastructure/repositories/GoogleSearchCampaignRepository";

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
    new GoogleSearchCampaignService(googleSearchCampaignRepository,new AuthService()),
    new SerperApiService()
  );

  try {
    const userResults = await serpApiService.handleApiRequest(data);

    return new Response(
      JSON.stringify({ success: true, data: JSON.stringify(userResults) }),
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
