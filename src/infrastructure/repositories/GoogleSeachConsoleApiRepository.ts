import axios from "axios";

import { IGoogleSearchConsoleApiRepository } from "@/domain/repository/IGoogleSeachConsoleApiRepository";

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
}