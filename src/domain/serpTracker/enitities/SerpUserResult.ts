import { SerpApiPeopleAsloAsk, SerpApiRelatedSearches, SerpApiResult, SuccessfulSerpApiFetches } from "@/domain/models/serperApi";

export class SerpUserResult {
  keywordId: string;
  resultTitle: string | undefined;
  resultURL: string | undefined;
  resultDescription: string | undefined;
  resultPosition: number | null;
  resultName: string;
  resultProjectdId: string;
  peopleAlsoAsk?: SerpApiPeopleAsloAsk[];
  relatedSearches?: SerpApiRelatedSearches[];
  userId: string;
  sitelinks?: any[];

  constructor(item: SerpApiResult, result: SuccessfulSerpApiFetches, isFiltered: boolean) {
    this.keywordId = item.keywordId;
    this.resultTitle = isFiltered ? item.title : undefined;
    this.resultURL = isFiltered ? item.link.replace(`https://${item.domain}`, "") : undefined;
    this.resultDescription = isFiltered ? item.snippet : undefined;
    this.resultPosition = isFiltered ? item.position : null;
    this.resultName = item.keywordName;
    this.resultProjectdId = item.projectId;
    this.peopleAlsoAsk = result.peopleAlsoAsk;
    this.relatedSearches = result.relatedSearches;
    this.userId = item.userId;
    this.sitelinks = item.sitelinks;
  }
}

