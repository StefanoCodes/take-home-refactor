import { z } from 'zod';
import {
  subscriptionTierSchema,
  campaignStatusSchema,
  paymentTypeSchema,
  paymentStatusSchema,
} from '../common';

// GET /api/sponsors/:id
const sponsorCampaignSchema = z.object({
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
  _count: z.object({
    placements: z.number(),
  }),
});

const sponsorPaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  type: paymentTypeSchema,
  status: paymentStatusSchema,
  stripePaymentId: z.string().nullable(),
  invoiceUrl: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sponsorId: z.string(),
});

export const getSponsorOutputSchema = z.object({
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
  campaigns: z.array(sponsorCampaignSchema),
  payments: z.array(sponsorPaymentSchema),
});

/**
 * TypeScript types
 */

export type GetSponsorOutput = z.infer<typeof getSponsorOutputSchema>;
