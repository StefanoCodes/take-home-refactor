import { z } from 'zod';
import { adSlotTypeSchema, successResponseSchema } from '../common';

// POST /api/ad-slots/:id/book
export const bookAdSlotInputSchema = z.object({
  sponsorId: z.string().min(1, { message: 'Sponsor ID is required' }),
  message: z.string().optional(),
});

export const bookAdSlotOutputSchema = successResponseSchema.extend({
  message: z.string(),
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
});

/**
 * TypeScript types
 */

export type BookAdSlotInput = z.infer<typeof bookAdSlotInputSchema>;
export type BookAdSlotOutput = z.infer<typeof bookAdSlotOutputSchema>;
