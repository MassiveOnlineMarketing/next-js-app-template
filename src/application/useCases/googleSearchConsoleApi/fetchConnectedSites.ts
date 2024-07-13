'use server';

import { GoogleSearchConsoleApiService } from "@/application/services/GoogleSearchConsoleApiService";

export async function fetchConnectedSites(refreshToken: string) {
  console.log('fetchConnectedSites use case');

  const googleSearchConsoleApiService = new GoogleSearchConsoleApiService();

  const res = await googleSearchConsoleApiService.fetchConnectedSites(refreshToken);

  return res;
}