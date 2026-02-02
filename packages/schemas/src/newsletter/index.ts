import { z } from 'zod';
import { successResponseSchema } from '../common';

// POST /api/newsletter
export const subscribeNewsletterInputSchema = z.object({
	email: z.string().email(),
});

export const subscribeNewsletterOutputSchema = successResponseSchema.extend({
	message: z.string(),
});

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterInputSchema>;
export type SubscribeNewsletterOutput = z.infer<typeof subscribeNewsletterOutputSchema>;
