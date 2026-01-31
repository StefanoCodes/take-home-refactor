import { z } from 'zod';
import { adSlotTypeSchema, creativeTypeSchema, placementStatusSchema, pricingModelSchema } from '../common';

// GET /api/placements
export const listPlacementsQuerySchema = z.object({
  campaignId: z.string().optional(),
  publisherId: z.string().optional(),
  status: placementStatusSchema.optional(),
});

export const placementListItemSchema = z.object({
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
    id: z.string(),
    name: z.string(),
  }),
  creative: z.object({
    id: z.string(),
    name: z.string(),
    type: creativeTypeSchema,
  }),
  adSlot: z.object({
    id: z.string(),
    name: z.string(),
    type: adSlotTypeSchema,
  }),
  publisher: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const listPlacementsOutputSchema = z.array(placementListItemSchema);

/**
 * TypeScript types
 */

export type ListPlacementsQuery = z.infer<typeof listPlacementsQuerySchema>;
export type PlacementListItem = z.infer<typeof placementListItemSchema>;
export type ListPlacementsOutput = z.infer<typeof listPlacementsOutputSchema>;
