import { z } from 'zod';
import {
  campaignStatusSchema,
  subscriptionTierSchema,
  creativeTypeSchema,
  adSlotTypeSchema,
  placementStatusSchema,
  pricingModelSchema,
} from '../common';

// GET /api/campaigns/:id
const campaignSponsorSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  website: z.string().nullable(),
  logo: z.string().nullable(),
  description: z.string().nullable(),
  industry: z.string().nullable(),
  subscriptionTier: subscriptionTierSchema,
  subscriptionEndsAt: z.string().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const campaignCreativeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: creativeTypeSchema,
  assetUrl: z.string(),
  clickUrl: z.string(),
  altText: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  isApproved: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  campaignId: z.string(),
});

const campaignPlacementSchema = z.object({
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
  adSlot: z.object({
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
  }),
  publisher: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string().nullable(),
  }),
});

export const getCampaignOutputSchema = z.object({
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
  sponsor: campaignSponsorSchema,
  creatives: z.array(campaignCreativeSchema),
  placements: z.array(campaignPlacementSchema),
});

/**
 * TypeScript types
 */

export type GetCampaignOutput = z.infer<typeof getCampaignOutputSchema>;
