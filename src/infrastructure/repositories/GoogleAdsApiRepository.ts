import { IGoogleAdsApiRepository } from "@/domain/repository/IGoogleAdsApiRepository";

import axios, { AxiosResponse } from "axios";

class GoogleAdsApiRepository implements IGoogleAdsApiRepository {
  async generateHistoricalMetrics(country: string, language: string, keywordString: string[]): Promise<AxiosResponse<any, any> | null> {
    try {
      // TODO: Make a constans + env variable for the adsApi URL
      // make api call to adsApi to get the keyword metrices
      const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/historical-metrics?country-code=${country}&language-code=${language}&keywords=${keywordString.join(",")}`
      // console.log('reqUrl', url)
      const res = await axios(url);

      return res;
    } catch (error) {
      console.error(error);
      return null
    }
  }
}

const googleAdsApiRepository = new GoogleAdsApiRepository();

export default googleAdsApiRepository;