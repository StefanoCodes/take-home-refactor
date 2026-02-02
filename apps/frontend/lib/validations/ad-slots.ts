import {
  bookAdSlotInputSchema,
  createAdSlotInputSchema,
  updateAdSlotInputSchema,
} from '@anvara/schemas';
import { z } from 'zod';

export const bookAdSlotSchema = bookAdSlotInputSchema.extend({
  adSlotId: z.string().min(1, { message: 'Ad slot ID is required' }),
});

export type BookAdSlotSchemaType = z.infer<typeof bookAdSlotSchema>;

export const unbookAdSlotSchema = z.object({
  adSlotId: z.string().min(1, { message: 'Ad slot ID is required' }),
});

export type UnbookAdSlotSchemaType = z.infer<typeof unbookAdSlotSchema>;

export { createAdSlotInputSchema, updateAdSlotInputSchema };

export type CreateAdSlotSchemaType = z.infer<typeof createAdSlotInputSchema>;

export const updateAdSlotFormSchema = updateAdSlotInputSchema.extend({
  adSlotId: z.string().min(1, { message: 'Ad slot ID is required' }),
});

export type UpdateAdSlotFormSchemaType = z.infer<typeof updateAdSlotFormSchema>;

export const deleteAdSlotSchema = z.object({
  adSlotId: z.string().min(1, { message: 'Ad slot ID is required' }),
});

export type DeleteAdSlotSchemaType = z.infer<typeof deleteAdSlotSchema>;
