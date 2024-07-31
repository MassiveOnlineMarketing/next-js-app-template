import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ? Splits a string of keywords by newline, trims each keyword, and removes any empty strings.
 *
 * @param keywords - The string of keywords to split and trim.
 * @returns An array of trimmed keywords.
 */
export function splitAndTrimKeywords(keywords: string): string[] {
  return keywords
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}


/**
 * Returns the URL for the favicon of a given website.
 * @param url - The URL of the website.
 * @returns The URL for the favicon.
 */
export function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
}

/**
 * Gets the appropriate greeting based on the current hour.
 *
 * @returns {string} The greeting message.
 */
export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

/**
 * Replaces the domain URL in a given URL with a forward slash ("/").
 * If the resulting URL does not start with a "/", it is prepended with one.
 * 
 * @param url - The URL to modify.
 * @param domainUrl - The domain URL to replace.
 * @returns The modified URL with the domain URL replaced by a forward slash. 
 *          If the resulting URL does not start with a "/", it is prepended with one.
 */
export function urlWithoutDomain(url: string, domainUrl: string): string {
  let result = url.replace(domainUrl, "");
  if (!result.startsWith("/")) {
    result = "/" + result;
  }
  return result;
}