import { z } from "zod";
import { bookAdSlotInputSchema } from "@anvara/schemas";

// Extends the shared schema with `adSlotId` (sent as a URL param, not in the API body)
export const bookAdSlotSchema = bookAdSlotInputSchema.extend({
	adSlotId: z.string().min(1),
});

export type BookAdSlotSchemaType = z.infer<typeof bookAdSlotSchema>;

export const unbookAdSlotSchema = z.object({
	adSlotId: z.string().min(1),
});

export type UnbookAdSlotSchemaType = z.infer<typeof unbookAdSlotSchema>;
