import { z } from 'zod';
import { adSlotTypeSchema } from '../common';

// POST /api/ad-slots
export const createAdSlotInputSchema = z.object({
  name: z.string().min(1, { message: 'Ad slot name is required' }),
  description: z.string().optional(),
  type: adSlotTypeSchema,
  basePrice: z.number({ required_error: 'Base price is required' }).positive({ message: 'Base price must be greater than 0' }),
  publisherId: z.string().min(1, { message: 'Publisher ID is required' }),
});

export const createAdSlotOutputSchema = z.object({
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
  publisher: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

/**
 * TypeScript types
 */

export type CreateAdSlotInput = z.infer<typeof createAdSlotInputSchema>;
export type CreateAdSlotOutput = z.infer<typeof createAdSlotOutputSchema>;
