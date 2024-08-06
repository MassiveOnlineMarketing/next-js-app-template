import { IGoogleAdsApi } from "@/domain/api/IGoogleAdsApi";

import axios, { AxiosResponse } from "axios";

class GoogleAdsApi implements IGoogleAdsApi {
  async generateHistoricalMetrics(country_code: string, language_code: string, keywordString: string[]): Promise<AxiosResponse<any, any> | null> {
    try {
      // make api call to adsApi to get the keyword metrices
      const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/historical-metrics?country-code=${country_code}&language-code=${language_code}&keywords=${keywordString.join(",")}`
      console.log('reqUrl', url)
      const res = await axios(url);

      return res;
    } catch (error) {
      console.error(error);
      return null
    }
  }
}

const googleAdsApi = new GoogleAdsApi();

export default googleAdsApi;