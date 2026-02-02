import { z } from 'zod';
import { campaignStatusSchema } from '../common';

// PUT /api/campaigns/:id
export const updateCampaignInputSchema = z.object({
  name: z.string().min(1, { message: 'Campaign name is required' }).optional(),
  description: z.string().optional(),
  budget: z.number().positive({ message: 'Budget must be greater than 0' }).optional(),
  cpmRate: z.number().optional(),
  cpcRate: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  targetCategories: z.array(z.string()).optional(),
  targetRegions: z.array(z.string()).optional(),
  status: campaignStatusSchema.optional(),
});

/**
 * TypeScript types
 */

export type UpdateCampaignInput = z.infer<typeof updateCampaignInputSchema>;
