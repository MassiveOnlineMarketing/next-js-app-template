import { z } from "zod";


export type WebsiteInputSchemaType = z.infer<typeof WebsiteInputSchema>;

export const WebsiteInputSchema = z.object({
  websiteName: z.string(),
  domainUrl: z.string(),
  gscUrl: z.string().optional(),
});
