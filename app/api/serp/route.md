// // app/api/serp.ts

// import { decrementUserCredits } from "@/auth/data/user";
// import { insertKeywordMetrics, KeywordMetricsInput } from "@/dashboard/google-search/data/google-ads-keyword-metrics";
// import { insertKeywords } from "@/dashboard/google-search/data/google-search-keyword";
// import {
//   getLatestKeywordResultWithTagByKeywordId,
//   insertUserResults,
// } from "@/dashboard/google-search/data/google-search-result";
// import { insertSERPResults } from "@/dashboard/google-search/data/google-search-serp-result";
// import { GoogleSearchKeyword } from "@prisma/client";
// import axios from "axios";

// const BATCH_SIZE = 100;
// export const maxDuration = 9;
// // export const maxDuration = 300;

// interface Data {
//   projectId: string;
//   keyword: string[];
//   language: string;
//   country: string;
//   domainUrl: string;
//   userId: string;
// }

// export async function POST(request: Request) {
//   const data: Data = await request.json();

//   const { projectId, keyword, language, country, domainUrl, userId } = data;

//   // console.time("addKeywordToProject"); // Start the timer
//   console.log("🟡 addKeywordToProject");

//   // add keywords to keywords table in the database
//   const keywords = await insertKeywords(projectId, keyword);

//   await handleGoogleAdsMetrics(keywords.keywordResponse, country, language, keyword);


//   // make api call to serperApi to get the serp results
//   const response = await fetchSERPResults(
//     keywords.keywordResponse,
//     language,
//     country,
//     domainUrl,
//     userId,
//     projectId,
//   );

//   // add user result to the result table in the database
//   await handleTopTenSerpResults(response);

//   // add top 10 results to the serpresults table in the database'
//   const userResultsArrays = await handleUserResults(response);

//   console.timeEnd("addKeywordToProject"); // End the timer
//   if (userResultsArrays.success && userResultsArrays.results) {
//     // decrement user credits
//     await decrementUserCredits(userId, userResultsArrays.results.length);

//     // Return the processed data
//     return new Response(JSON.stringify(userResultsArrays), {
//       headers: { "Content-Type": "application/json" },
//     });
//   }

//   console.log("🔴 Error inserting user results");
//   return new Response(
//     JSON.stringify({ error: "Error inserting user results" }),
//     {
//       headers: { "Content-Type": "application/json" },
//     },
//   );
// }

// interface KeywordProps {
//   id: string;
//   keyword: string;
// }

// export type SuccessfulSerpApiFetches = {
//   organic: SerpApiResult[];
//   peopleAlsoAsk?: SerpApiPeopleAsloAsk[];
//   relatedSearches?: SerpApiRelatedSearches[];
// };
// // FetchItem and SuccessfulFetches types
// export type SerpApiResult = {
//   title: string;
//   link: string;
//   snippet: string;
//   position: number;
//   keywordId: string;
//   projectId: string;
//   domain: string;
//   keywordName: string;
//   sitelinks?: any[];
//   rating?: number;
//   ratingCount?: number;
//   priceRange?: string;
//   userId: string;
// };

// export type SerpApiPeopleAsloAsk = {
//   question: string;
//   snippet: string;
//   title: string;
//   link: string;
// };

// export type SerpApiRelatedSearches = {
//   query: string;
// };

// async function fetchSERPResults(
//   keywords: KeywordProps[],
//   projectLanguage: string,
//   projectCountry: string,
//   projectDomain: string,
//   userId: string,
//   projectId: string,
// ) {
//   const dataTYL = keywords.map((keyword) => ({
//     q: keyword.keyword,
//     gl: projectCountry,
//     hl: projectLanguage,
//     autocorrect: false,
//     num: 100,
//   }));

//   // Error handling
//   var successfulFetches = [];
//   var failedFetches = [];

//   let data = JSON.stringify(dataTYL);

//   let config = {
//     method: "post",
//     url: "https://google.serper.dev/search",
//     headers: {
//       // soyojip238@seosnaps.com 196

//       "X-API-KEY": process.env.SERPER_API_KEY,
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   try {
//     const response = await axios(config);
//     for (let i = 0; i < response.data.length; i++) {
//       const result = response.data[i];

//       let foramtedResult: SuccessfulSerpApiFetches = {
//         organic: [],
//         peopleAlsoAsk: [],
//         relatedSearches: [],
//       };

//       if (result.organic.length > 0) {
//         result.organic.forEach((item: any) => {
//           item.keywordId = keywords[i].id;
//           item.domain = projectDomain;
//           item.keywordName = keywords[i].keyword;
//           item.userId = userId;
//           item.projectId = projectId;
//         });
//         foramtedResult.organic.push(...result.organic);
//       } else {
//         failedFetches.push(keywords[i]);
//       }
//       if (result.relatedSearches) {
//         foramtedResult.relatedSearches?.push(...result.relatedSearches);
//       }

//       if (result.peopleAlsoAsk) {
//         foramtedResult.peopleAlsoAsk?.push(...result.peopleAlsoAsk);
//       }

//       successfulFetches.push(foramtedResult);
//     }
//   } catch (error) {
//     console.error("🔴 Error with the API call:", error);
//   }

//   if (failedFetches.length === 0) {
//     console.log(
//       `🟢 Successfully fetched all ${successfulFetches.length} keyword results from SERP API`,
//     );
//   } else {
//     console.log(`🔴 Failed to fetch ${failedFetches.length} keyword results`);
//   }

//   return successfulFetches;
// }

// type Keyword = {
//   keyword: string;
//   id: string;
// };

// async function handleGoogleAdsMetrics(keywords: Keyword[], country: string, language: string, keyword: string[]) {
//     // Create a dictionary where the keys are the keyword texts and the values are the keyword IDs
//     const keywordIdMap = keywords.reduce<{ [key: string]: string }>((map, keyword) => {
//       map[keyword.keyword] = keyword.id;
//       return map;
//     }, {});
//     // console.log('keywordIdMap', keywordIdMap);
  
//     // TODO: Make a constans + env variable for the adsApi URL
//     // make api call to adsApi to get the keyword metrices
//     const reqUrl = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/historical-metrics?country-code=${country}&language-code=${language}&keywords=${keyword.join(",")}`
//     console.log('reqUrl', reqUrl)
//     const keywordMetricsRes = await axios(reqUrl);
  
//     // console.log('keywordMetricsRes', keywordMetricsRes);
  
//     // Map the response to include the keyword IDs
//     const resultsWithIds = keywordMetricsRes.data.result.results.map((result: KeywordMetricsInput) => {
//       return {
//         ...result,
//         id: keywordIdMap[result.text]
//       };
//     });
  
//     // console.log('resultsWithIds', resultsWithIds);
//     insertKeywordMetrics(resultsWithIds);
// }

// async function handleTopTenSerpResults(response: SuccessfulSerpApiFetches[]) {
//   // Prepare data for batch insert
//   const insertData = [];
//   for (const results of response) {
//     for (const result of results.organic.slice(0, 10)) {
//       insertData.push({
//         keywordId: result.keywordId,
//         position: result.position,
//         url: result.link,
//         metaTitle: result.title,
//         metaDescription: result.snippet,
//       });
//     }
//   }

//   // Perform batch insert
//   try {
//     await insertSERPResults(insertData);

//     console.log(
//       `🟢 Successfully inserted all ${insertData.length} results in SERPResults Table`,
//     );
//   } catch (error) {
//     console.error(`🔴 Error inserting results:`, error);
//   }
// }

// /**
//  * Handles user results by extracting data from the provided SERP results,
//  * creating new user results based on the extracted data, and inserting them
//  * into the database.
//  *
//  * @param serpResults - An array of SuccessfulSerpApiFetches containing the SERP results.
//  * @returns An object containing the results of the operation.
//  */
// async function handleUserResults(serpResults: SuccessfulSerpApiFetches[]) {
//   const newResults: UserResult[] = [];
//   console.log("🟡 handle user results");

//   for (const result of serpResults) {
//     const userResult = extractDataFromResults(result);

//     newResults.push(userResult);
//   }

//   const userResults = await insertUserResults(newResults);

//   if (userResults.success) {
//     const keywordIds = newResults.map((result) => result.keywordId);
//     const results = await getLatestKeywordResultWithTagByKeywordId(keywordIds);

//     return { success: "Successfully inserted user results", results };
//   }

//   return { error: "Error inserting user results" };
// }

// export type UserResult = {
//   keywordId: string;
//   resultTitle: string | undefined;
//   resultURL: string | undefined;
//   resultDescription: string | undefined;
//   resultPosition: number | null;
//   resultName: string;
//   resultProjectdId: string;
//   peopleAlsoAsk?: SerpApiPeopleAsloAsk[];
//   relatedSearches?: SerpApiRelatedSearches[];
//   userId: string;
// };

// /**
//  * Extracts the users data from the results of a successful SERP API fetch.
//  * @param result - The result object containing the fetched data.
//  * @returns The extracted user result.
//  */
// function extractDataFromResults(result: SuccessfulSerpApiFetches): UserResult {
//   const filteredResults = result.organic.filter((item) =>
//     item.link.includes(item.domain),
//   );
//   // console.log('filteredResults', filteredResults);

//   if (filteredResults.length === 0) {
//     return {
//       keywordId: result.organic[0].keywordId,
//       resultTitle: undefined,
//       resultURL: undefined,
//       resultDescription: undefined,
//       resultPosition: null,
//       resultName: result.organic[0].keywordName,
//       resultProjectdId: result.organic[0].projectId,
//       peopleAlsoAsk: result.peopleAlsoAsk,
//       relatedSearches: result.relatedSearches,
//       userId: result.organic[0].userId,
//     };
//   }

//   const item = filteredResults[0];
//   return {
//     keywordId: item.keywordId,
//     resultTitle: item.title,
//     resultURL: item.link.replace(`https://${item.domain}`, ""),
//     resultDescription: item.snippet,
//     resultPosition: item.position,
//     resultName: item.keywordName,
//     resultProjectdId: item.projectId,
//     peopleAlsoAsk: result.peopleAlsoAsk,
//     relatedSearches: result.relatedSearches,
//     userId: item.userId,
//   };
// }
