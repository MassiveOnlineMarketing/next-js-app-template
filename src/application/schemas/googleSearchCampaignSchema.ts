import * as z from 'zod';
import { GoogleSearchLocation } from '@/domain/models/serperApi';
import { LOCATIONS } from '@/presentation/components/google-search-campaign/location-constant';
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS, GoogleSearchCountry, GoogleSearchLanguage } from '@/presentation/components/google-search-campaign/form-options';


export type GoogleSearchCampaignSchemaType = z.infer<typeof GoogleSearchCampaignSchema>;

const locationValidator = z.custom((location: GoogleSearchLocation) => {
  if (!location) return true;
  return LOCATIONS.some(loc => 
    loc.name === location.name &&
    loc.canonicalName === location.canonicalName &&
    loc.googleId === location.googleId &&
    loc.countryCode === location.countryCode &&
    loc.targetType === location.targetType
  );
}, { message: "Location object does not match any object in the LOCATIONS array" });

const languageValidator = z.custom((language: GoogleSearchLanguage) => {
  if (!language) return false;
  return GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.some(lang => 
    lang.countryCode === language.countryCode &&
    lang.name === language.name &&
    lang.googleId === language.googleId
  );
}, { message: "Please (re) select a language" });

const countryValidator = z.custom((country: GoogleSearchCountry) => {
  if (!country) return false;
  return GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.some(c => 
    c.countryCode === country.countryCode &&
    c.name === country.name &&
    c.googleId === country.googleId
  );
}, { message: "Please (re) select a country" });

export const GoogleSearchCampaignSchema= z.object({
  campaignName: z.string().min(1, { message: "Campaign name is required" }),
  language: languageValidator as z.ZodType<GoogleSearchLanguage, any, any>,
  location: locationValidator.optional() as z.ZodType<GoogleSearchLocation, any, any>,
  country: countryValidator as z.ZodType<GoogleSearchCountry, any, any>,
  specificDaysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])),
  keywords: z.string().optional(),
});