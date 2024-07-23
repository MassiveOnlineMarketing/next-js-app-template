export type SuccessfulSerpApiFetches = {
  organic: SerpApiResult[];
  peopleAlsoAsk?: SerpApiPeopleAsloAsk[];
  relatedSearches?: SerpApiRelatedSearches[];
};
// FetchItem and SuccessfulFetches types
export type SerpApiResult = {
  title: string;
  link: string;
  snippet: string;
  position: number;
  keywordId: string;
  projectId: string;
  domain: string;
  keywordName: string;
  sitelinks?: any[];
  rating?: number;
  ratingCount?: number;
  priceRange?: string;
  userId: string;
};

export type SerpApiPeopleAsloAsk = {
  question: string;
  snippet: string;
  title: string;
  link: string;
};

export type SerpApiRelatedSearches = {
  query: string;
};



export type GoogleSearchLocation = {
  name: string;
  canonicalName: string;
  googleId: number;
  countryCode: string;
  targetType: string;
} 