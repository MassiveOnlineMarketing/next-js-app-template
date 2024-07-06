import { z } from "zod";


export type WebsiteSchemaType = z.infer<typeof WebsiteSchema>;

export const WebsiteSchema = z.object({
  websiteName: z.string(),
  domainUrl: z.string(),
  gscUrl: z.string().optional(),
});
