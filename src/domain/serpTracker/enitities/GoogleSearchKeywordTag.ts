import { utilityService } from "@/application/services/UtitlityService";
import { GoogleSearchKeyword } from "./GoogleSearchKeyword";

export class GoogleSearchKeywordTag{
  id: string;
  name: string;
  keywords: GoogleSearchKeyword[];

  constructor(id: string, name: string, keywords: GoogleSearchKeyword[]){
    this.id = id;
    this.name = name;
    this.keywords = keywords;
  }

  /**
   * Generates a new GoogleSearchKeywordTag instance.
   * 
   * @param name - The name of the tag.
   * @returns A new GoogleSearchKeywordTag instance.
   */
  static generateNewTag(
    name: string,
  ){
    const UtilityService = new utilityService()
    return new GoogleSearchKeywordTag(
      UtilityService.genereateUUID(),
      name,
      []
    );
  }
  
  /**
   * Converts the GoogleSearchKeywordTag instance to a plain JavaScript object.
   * Mainly used for serialization. To pass the object from the server to the client.
   * @returns {Object} The plain JavaScript object representation of the GoogleSearchKeywordTag instance.
   */
  toPlainObject(){
    return {
      id: this.id,
      name: this.name,
      keywords: this.keywords
    }
  }
}