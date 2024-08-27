import axios from "axios";

import { IGoogleSearchConsoleApiRepository } from "@/domain/repository/IGoogleSeachConsoleApiRepository";
import { GoogleSearchConsoleKeywordDetailsData } from "@/domain/models/googleSearchConsoleApi";

export type PythonApiSite = {
  premissionLevel: string;
  siteUrl: string;
};

export default class GoogleSearchConsoleApiRepository implements IGoogleSearchConsoleApiRepository {

  async getConnectedSites(refreshToken: string): Promise<PythonApiSite[] | null> {
    try {
      const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/get_sites?refresh_token=${refreshToken}`;
      // TODO: check of ook met react query kan
      const res = await axios(url);

      return res.data.siteEntry;
    } catch (error) {
      console.error(error);
      return null
    }
  }

  async getKeywordDetailsData(keywordName: string, gscUrl: string, refresh_token: string, countryCode: string): Promise<GoogleSearchConsoleKeywordDetailsData | null> {
    const encodedKeyword = encodeURIComponent(keywordName);

    try {
      const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/keyword_data?keyword=${encodedKeyword}&site_url=${gscUrl}&refresh_token=${refresh_token}&country_code=${countryCode}`;
      const res = await axios(url);

      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getTopPerformingKeywordsByCountry(amountOfKeywords: number, gscUrl: string, refresh_token: string, countryCode: string) {
    try {
      const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/import_keywords?site-url=${gscUrl}&amount-of-keywords=${amountOfKeywords}&refresh-token=${refresh_token}&country=${countryCode}`;
      const res = await axios(url);

      return res.data;
    } catch (error) {
      console.error('Google Search Console Api - top performing keywords',error);
      return null;
    }
  }
}