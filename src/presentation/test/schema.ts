import { GoogleSearchLocation } from '@/domain/models/serperApi';
import * as z from 'zod';
import { LOCATIONS } from '../components/google-search-campaign/location-constant';
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from '../components/google-search-campaign/form-options';


export type TestSchemaType = z.infer<typeof TestSchema>;
export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

const locations = LOCATIONS

const locationValidator = z.custom((location) => {
  return LOCATIONS.some(loc => 
    loc.name === location.name &&
    loc.canonicalName === location.canonicalName &&
    loc.googleId === location.googleId &&
    loc.countryCode === location.countryCode &&
    loc.targetType === location.targetType
  );
}, { message: "Location object does not match any object in the LOCATIONS array" });

const languageValidator = z.custom((language) => {
  return GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.some(lang => 
    lang.value === language.value &&
    lang.label === language.label &&
    lang.criterionId === language.criterionId
  );
}, { message: "Language does not match any object in the GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS array" });

const countryValidator = z.custom((country) => {
  return GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.some(c => 
    c.value === country.value &&
    c.label === country.label &&
    c.criterionId === country.criterionId
  );
}, { message: "Country does not match any object in the GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS array" });

export const TestSchema = z.object({
  campaignName: z.string(),
  language: languageValidator,
  location: locationValidator,
  country: countryValidator,
  specificDaysOfWeek: z.array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])).optional(),
  keywords: z.string().optional(),
});
