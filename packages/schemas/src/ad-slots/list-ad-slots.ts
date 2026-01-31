import { z } from 'zod';
import { adSlotTypeSchema } from '../common';

// GET /api/ad-slots
export const listAdSlotsQuerySchema = z.object({
  publisherId: z.string().optional(),
  type: adSlotTypeSchema.optional(),
  available: z.string().optional(),
});

export const adSlotListItemSchema = z.object({
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
    category: z.string().nullable(),
    monthlyViews: z.number(),
  }),
  _count: z.object({
    placements: z.number(),
  }),
});

export const listAdSlotsOutputSchema = z.array(adSlotListItemSchema);

/**
 * TypeScript types
 */

export type ListAdSlotsQuery = z.infer<typeof listAdSlotsQuerySchema>;
export type AdSlotListItem = z.infer<typeof adSlotListItemSchema>;
export type ListAdSlotsOutput = z.infer<typeof listAdSlotsOutputSchema>;
