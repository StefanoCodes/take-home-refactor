import { z } from 'zod';
import { successResponseSchema } from '../common';

export const quoteStatusSchema = z.enum([
	'PENDING',
	'RESPONDED',
	'ACCEPTED',
	'DECLINED',
]);

export const quoteRequestSchema = z.object({
	id: z.string(),
	companyName: z.string(),
	email: z.string(),
	phone: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	status: quoteStatusSchema,
	adSlotId: z.string(),
	userId: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// POST /api/quotes
export const requestQuoteInputSchema = z.object({
	companyName: z.string().min(1, { message: 'Company name is required' }),
	email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
	phone: z.string().optional(),
	message: z.string().optional(),
	adSlotId: z.string().min(1, { message: 'Ad slot is required' }),
});

export const requestQuoteOutputSchema = successResponseSchema.extend({
	message: z.string(),
	quoteId: z.string(),
});

// GET /api/quotes/mine
export const listUserQuotesOutputSchema = z.object({
	data: z.array(quoteRequestSchema),
});

// GET /api/quotes (publisher)
export const publisherQuoteRequestSchema = quoteRequestSchema.extend({
	adSlot: z.object({
		id: z.string(),
		name: z.string(),
	}),
});

export const listPublisherQuotesOutputSchema = z.object({
	data: z.array(publisherQuoteRequestSchema),
});

// PATCH /api/quotes/:id/status
export const updateQuoteStatusInputSchema = z.object({
	status: quoteStatusSchema,
});

export const updateQuoteStatusOutputSchema = successResponseSchema.extend({
	message: z.string(),
});

export type QuoteStatus = z.infer<typeof quoteStatusSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type PublisherQuoteRequest = z.infer<typeof publisherQuoteRequestSchema>;
export type RequestQuoteInput = z.infer<typeof requestQuoteInputSchema>;
export type RequestQuoteOutput = z.infer<typeof requestQuoteOutputSchema>;
export type ListUserQuotesOutput = z.infer<typeof listUserQuotesOutputSchema>;
export type ListPublisherQuotesOutput = z.infer<typeof listPublisherQuotesOutputSchema>;
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusInputSchema>;
export type UpdateQuoteStatusOutput = z.infer<typeof updateQuoteStatusOutputSchema>;
