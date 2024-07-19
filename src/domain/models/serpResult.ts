import { SerpApiRelatedSearches, SerpApiPeopleAsloAsk } from "./serperApi";

export type SerpResult = {
  keywordId: string;
  position: number;
  url: string;
  metaTitle: string;
  metaDescription: string;
}

export type UserSerpResult = {
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
}