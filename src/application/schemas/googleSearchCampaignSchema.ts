import * as z from 'zod';


export type GoogleSearchCampaignSchemaType = z.infer<typeof GoogleSearchCampaignSchema>;

export const GoogleSearchCampaignSchema = z.object({
  projectName: z.string(),
  isMobile: z.boolean(),
  specificDaysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(),
  // language should max be 2 characters and min 2 characters, also needs to be one of the following: nl, en, de, fr
  language: z
    .string()
    .length(2)
    .refine(
      (value) =>
        [
          "en",
          "fr",
          "de",
          "es",
          "it",
          "nl",
          "ru",
          "jp",
          "kr",
          "cn",
          "br",
        ].includes(value),
      {
        message: "Language must be one of 'nl', 'en', 'de', 'fr'",
      },
    ),
  country: z
    .string()
    .length(2)
    .refine(
      (value) =>
        [
          "US",
          "GB",
          "CA",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "JP",
          "KR",
          "BR",
          "RU",
          "CN",
        ].includes(value),
      {
        message: "Country must be one of 'nl', 'en', 'de', 'fr'",
      },
    ),
  gscSite: z.string().optional(),
  keywords: z.string().optional(),
});



// const IntervalType = z.enum(['DAILY', 'EVERY_X_DAYS', 'SPECIFIC_DAYS_OF_WEEK']);

// const googleSearchCampaignSchema = z.object({
//   // Other fields...
//   intervalType: IntervalType,
//   intervalDays: z.number().optional(), // Used if intervalType is EVERY_X_DAYS
//   specificDaysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(), // Used if intervalType is SPECIFIC_DAYS_OF_WEEK
// });

// // Example of conditional validation
// const validateIntervalDetails = (data: any) => {
//   if (data.intervalType === 'EVERY_X_DAYS' && (data.intervalDays === undefined || data.intervalDays < 1)) {
//     throw new Error('Interval days must be provided and greater than 0 for EVERY_X_DAYS option.');
//   }
//   if (data.intervalType === 'SPECIFIC_DAYS_OF_WEEK' && (!data.specificDaysOfWeek || data.specificDaysOfWeek.length === 0)) {
//     throw new Error('At least one day of the week must be selected for SPECIFIC_DAYS_OF_WEEK option.');
//   }
// };