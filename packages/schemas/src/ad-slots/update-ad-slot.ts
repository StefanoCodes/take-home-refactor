import { z } from 'zod';
import { adSlotTypeSchema } from '../common';

// PUT /api/ad-slots/:id
export const updateAdSlotInputSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: adSlotTypeSchema.optional(),
  basePrice: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
});

/**
 * TypeScript types
 */

export type UpdateAdSlotInput = z.infer<typeof updateAdSlotInputSchema>;
