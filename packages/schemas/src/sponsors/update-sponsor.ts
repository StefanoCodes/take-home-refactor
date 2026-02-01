import { z } from "zod";

// PUT /api/sponsors/:id
export const updateSponsorInputSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	website: z.string().optional(),
	logo: z.string().optional(),
	description: z.string().optional(),
	industry: z.string().optional(),
});

export type UpdateSponsorInput = z.infer<typeof updateSponsorInputSchema>;
