import { subscribeNewsletterInputSchema } from '@anvara/schemas';
import { z } from 'zod';

export { subscribeNewsletterInputSchema };

export type SubscribeNewsletterSchemaType = z.infer<typeof subscribeNewsletterInputSchema>;
