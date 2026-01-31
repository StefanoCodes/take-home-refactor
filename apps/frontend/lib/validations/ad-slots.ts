import { z } from "zod";

export const bookAdSlotSchema = z.object({
	adSlotId: z.string().min(1),
	sponsorId: z.string().min(1),
	message: z.string().optional(),
});

export type BookAdSlotSchemaType = z.infer<typeof bookAdSlotSchema>;

export const unbookAdSlotSchema = z.object({
	adSlotId: z.string().min(1),
});

export type UnbookAdSlotSchemaType = z.infer<typeof unbookAdSlotSchema>;
