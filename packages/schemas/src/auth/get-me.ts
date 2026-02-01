import { z } from 'zod';

// GET /api/auth/me
export const getMeOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    image: z.string().nullable().optional(),
    emailVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export type GetMeOutput = z.infer<typeof getMeOutputSchema>;
