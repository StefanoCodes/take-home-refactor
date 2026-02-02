import { z } from 'zod';
import { campaignStatusSchema } from '../common';

// POST /api/campaigns
export const createCampaignInputSchema = z.object({
  name: z.string().min(1, { message: 'Campaign name is required' }),
  description: z.string().optional(),
  budget: z.number({ required_error: 'Budget is required' }).positive({ message: 'Budget must be greater than 0' }),
  cpmRate: z.number().optional(),
  cpcRate: z.number().optional(),
  startDate: z.string({ required_error: 'Start date is required' }).min(1, { message: 'Start date is required' }),
  endDate: z.string({ required_error: 'End date is required' }).min(1, { message: 'End date is required' }),
  targetCategories: z.array(z.string()).optional(),
  targetRegions: z.array(z.string()).optional(),
  sponsorId: z.string().min(1, { message: 'Sponsor ID is required' }),
});

export const createCampaignOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  budget: z.coerce.number(),
  spent: z.coerce.number(),
  cpmRate: z.coerce.number().nullable(),
  cpcRate: z.coerce.number().nullable(),
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
