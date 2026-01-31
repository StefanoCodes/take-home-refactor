import { z } from 'zod';

// GET /api/dashboard/stats
export const getDashboardStatsOutputSchema = z.object({
  sponsors: z.number(),
  publishers: z.number(),
  activeCampaigns: z.number(),
  totalPlacements: z.number(),
  metrics: z.object({
    totalImpressions: z.number(),
    totalClicks: z.number(),
    totalConversions: z.number(),
    avgCtr: z.union([z.string(), z.number()]),
  }),
});

/**
 * TypeScript types
 */

export type GetDashboardStatsOutput = z.infer<typeof getDashboardStatsOutputSchema>;
