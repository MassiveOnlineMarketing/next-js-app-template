import { SerperApiSerpResult } from "@/domain/models/serperApi";

export class SerperApiResult {
  keywordId: string;
  position: number;
  url: string;
  metaTitle: string;
  metaDescription: string;

  constructor(result: SerperApiSerpResult) {
    this.keywordId = result.keywordId;
    this.position = result.position;
    this.url = result.link;
    this.metaTitle = result.title;
    this.metaDescription = result.snippet;
  }
}