import { z } from 'zod';
import { successResponseSchema } from '../common';

// POST /api/newsletter
export const subscribeNewsletterInputSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
});

export const subscribeNewsletterOutputSchema = successResponseSchema.extend({
	message: z.string(),
});

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterInputSchema>;
export type SubscribeNewsletterOutput = z.infer<typeof subscribeNewsletterOutputSchema>;
