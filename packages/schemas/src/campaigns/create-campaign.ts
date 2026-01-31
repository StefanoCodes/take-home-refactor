import { z } from 'zod';
import { campaignStatusSchema } from '../common';

// POST /api/campaigns
export const createCampaignInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  budget: z.number().positive(),
  cpmRate: z.number().optional(),
  cpcRate: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  targetCategories: z.array(z.string()).optional(),
  targetRegions: z.array(z.string()).optional(),
  sponsorId: z.string().min(1),
});

export const createCampaignOutputSchema = z.object({
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
  }),
});

/**
 * TypeScript types
 */

export type CreateCampaignInput = z.infer<typeof createCampaignInputSchema>;
export type CreateCampaignOutput = z.infer<typeof createCampaignOutputSchema>;
