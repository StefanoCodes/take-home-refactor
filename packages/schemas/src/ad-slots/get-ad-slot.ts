import { z } from 'zod';
import { adSlotTypeSchema, campaignStatusSchema, placementStatusSchema, pricingModelSchema } from '../common';

// GET /api/ad-slots/:id
const adSlotPlacementSchema = z.object({
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
    status: campaignStatusSchema,
  }),
});

const adSlotPublisherSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  website: z.string().nullable(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  monthlyViews: z.number(),
  subscriberCount: z.number(),
  category: z.string().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getAdSlotOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: adSlotTypeSchema,
  position: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  basePrice: z.number(),
  cpmFloor: z.number().nullable(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publisherId: z.string(),
  publisher: adSlotPublisherSchema,
  placements: z.array(adSlotPlacementSchema),
});

/**
 * TypeScript types
 */

export type GetAdSlotOutput = z.infer<typeof getAdSlotOutputSchema>;
