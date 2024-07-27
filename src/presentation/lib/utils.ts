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
