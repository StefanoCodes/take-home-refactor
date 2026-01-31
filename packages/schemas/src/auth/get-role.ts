import { z } from 'zod';

// GET /api/auth/role/:userId
export const getUserRoleOutputSchema = z.union([
  z.object({
    role: z.literal('sponsor'),
    sponsorId: z.string(),
    name: z.string(),
  }),
  z.object({
    role: z.literal('publisher'),
    publisherId: z.string(),
    name: z.string(),
  }),
  z.object({
    role: z.null(),
  }),
]);

/**
 * TypeScript types
 */

export type GetUserRoleOutput = z.infer<typeof getUserRoleOutputSchema>;
