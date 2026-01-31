import { z } from 'zod';

// GET /api/health
export const getHealthOutputSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']),
});

/**
 * TypeScript types
 */

export type GetHealthOutput = z.infer<typeof getHealthOutputSchema>;
