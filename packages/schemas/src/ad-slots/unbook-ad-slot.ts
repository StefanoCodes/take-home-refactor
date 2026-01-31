import { z } from 'zod';
import { adSlotTypeSchema, successResponseSchema } from '../common';

// POST /api/ad-slots/:id/unbook
export const unbookAdSlotOutputSchema = successResponseSchema.extend({
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

export type UnbookAdSlotOutput = z.infer<typeof unbookAdSlotOutputSchema>;
