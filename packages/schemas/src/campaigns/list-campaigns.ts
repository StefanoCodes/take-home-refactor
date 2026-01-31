import { z } from 'zod';
import { campaignStatusSchema } from '../common';

// GET /api/campaigns
export const listCampaignsQuerySchema = z.object({
  status: campaignStatusSchema.optional(),
  sponsorId: z.string().optional(),
});

export const campaignListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  budget: z.number(),
  spent: z.number(),
  cpmRate: z.number().nullable(),
  cpcRate: z.number().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  targetCategories: z.array(z.string()),
  targetRegions: z.array(z.string()),
  status: campaignStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  sponsorId: z.string(),
  sponsor: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().nullable(),
  }),
  _count: z.object({
    creatives: z.number(),
    placements: z.number(),
  }),
});

export const listCampaignsOutputSchema = z.array(campaignListItemSchema);

/**
 * TypeScript types
 */

export type ListCampaignsQuery = z.infer<typeof listCampaignsQuerySchema>;
export type CampaignListItem = z.infer<typeof campaignListItemSchema>;
export type ListCampaignsOutput = z.infer<typeof listCampaignsOutputSchema>;
