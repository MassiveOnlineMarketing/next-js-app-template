import { SerpApiResult } from "@/domain/models/serperApi";

export class SerpResult {
  keywordId: string;
  position: number;
  url: string;
  metaTitle: string;
  metaDescription: string;

  constructor(result: SerpApiResult) {
    this.keywordId = result.keywordId;
    this.position = result.position;
    this.url = result.link;
    this.metaTitle = result.title;
    this.metaDescription = result.snippet;
  }
}