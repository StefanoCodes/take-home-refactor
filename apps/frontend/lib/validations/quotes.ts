import { requestQuoteInputSchema, updateQuoteStatusInputSchema } from '@anvara/schemas';
import { z } from 'zod';

export { requestQuoteInputSchema, updateQuoteStatusInputSchema };

export type RequestQuoteSchemaType = z.infer<typeof requestQuoteInputSchema>;
export type UpdateQuoteStatusSchemaType = z.infer<typeof updateQuoteStatusInputSchema>;
