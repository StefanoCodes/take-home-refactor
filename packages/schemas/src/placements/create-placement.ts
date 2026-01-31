import { z } from 'zod';
import { placementStatusSchema, pricingModelSchema } from '../common';

// POST /api/placements
export const createPlacementInputSchema = z.object({
  campaignId: z.string().min(1),
  creativeId: z.string().min(1),
  adSlotId: z.string().min(1),
  publisherId: z.string().min(1),
  agreedPrice: z.number().positive(),
  pricingModel: pricingModelSchema.optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export const createPlacementOutputSchema = z.object({
  id: z.string(),
  impressions: z.number(),
  clicks: z.number(),
  conversions: z.number(),
  agreedPrice: z.number(),
  pricingModel: pricingModelSchema,
  startDate: z.string(),
  endDate: z.string(),
  status: placementStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  campaignId: z.string(),
  creativeId: z.string(),
  adSlotId: z.string(),
  publisherId: z.string(),
  campaign: z.object({
    name: z.string(),
  }),
  publisher: z.object({
    name: z.string(),
  }),
});

/**
 * TypeScript types
 */

export type CreatePlacementInput = z.infer<typeof createPlacementInputSchema>;
export type CreatePlacementOutput = z.infer<typeof createPlacementOutputSchema>;
