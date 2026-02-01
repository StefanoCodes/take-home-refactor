import { z } from "zod";
import { adSlotTypeSchema } from "../common";

// GET /api/ad-slots
export const listAdSlotsQuerySchema = z.object({
	publisherId: z.string().optional(),
	type: adSlotTypeSchema.optional(),
	available: z.string().optional(),
	page: z.coerce.number().int().min(1).optional().default(1),
	limit: z.coerce.number().int().min(1).max(50).optional().default(6),
});

export const adSlotListItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	type: adSlotTypeSchema,
	position: z.string().nullable(),
	width: z.number().nullable(),
	height: z.number().nullable(),
	basePrice: z.coerce.number(),
	cpmFloor: z.coerce.number().nullable(),
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

export const listAdSlotsOutputSchema = z.object({
	data: z.array(adSlotListItemSchema),
	pagination: z.object({
		page: z.number(),
		limit: z.number(),
		total: z.number(),
		totalPages: z.number(),
		hasMore: z.boolean(),
	}),
});

/**
 * TypeScript types
 */

export type ListAdSlotsQuery = z.infer<typeof listAdSlotsQuerySchema>;
export type AdSlotListItem = z.infer<typeof adSlotListItemSchema>;
export type ListAdSlotsOutput = z.infer<typeof listAdSlotsOutputSchema>;
