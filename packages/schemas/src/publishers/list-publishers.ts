import { z } from 'zod';

// GET /api/publishers
export const publisherListItemSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  website: z.string().nullable(),
  avatar: z.string().nullable(),
  bio: z.string().nullable(),
  monthlyViews: z.number(),
  subscriberCount: z.number(),
  category: z.string().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z.object({
    adSlots: z.number(),
    placements: z.number(),
  }),
});

export const listPublishersOutputSchema = z.array(publisherListItemSchema);

/**
 * TypeScript types
 */

export type PublisherListItem = z.infer<typeof publisherListItemSchema>;
export type ListPublishersOutput = z.infer<typeof listPublishersOutputSchema>;
