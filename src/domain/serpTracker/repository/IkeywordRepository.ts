import { TKeyword } from "../enitities/Keyword";

export interface IKeywordRepository {
  createBulk(keywords: TKeyword[]): Promise<boolean>;

}