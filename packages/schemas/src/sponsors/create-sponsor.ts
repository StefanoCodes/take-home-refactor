import { z } from 'zod';
import { subscriptionTierSchema } from '../common';

// POST /api/sponsors
export const createSponsorInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
});

export const createSponsorOutputSchema = z.object({
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

/**
 * TypeScript types
 */

export type CreateSponsorInput = z.infer<typeof createSponsorInputSchema>;
export type CreateSponsorOutput = z.infer<typeof createSponsorOutputSchema>;
