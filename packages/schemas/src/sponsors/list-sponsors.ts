import { z } from 'zod';
import { subscriptionTierSchema } from '../common';

// GET /api/sponsors
export const sponsorListItemSchema = z.object({
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
  _count: z.object({
    campaigns: z.number(),
  }),
});

export const listSponsorsOutputSchema = z.array(sponsorListItemSchema);

/**
 * TypeScript types
 */

export type SponsorListItem = z.infer<typeof sponsorListItemSchema>;
export type ListSponsorsOutput = z.infer<typeof listSponsorsOutputSchema>;
