import {
	createCampaignInputSchema,
	updateCampaignInputSchema,
} from "@anvara/schemas";
import { z } from "zod";

export { createCampaignInputSchema, updateCampaignInputSchema };

export type CreateCampaignSchemaType = z.infer<
	typeof createCampaignInputSchema
>;

export const updateCampaignFormSchema = updateCampaignInputSchema.extend({
	campaignId: z.string().min(1),
});

export type UpdateCampaignFormSchemaType = z.infer<
	typeof updateCampaignFormSchema
>;

export const deleteCampaignSchema = z.object({
	campaignId: z.string().min(1),
});

export type DeleteCampaignSchemaType = z.infer<typeof deleteCampaignSchema>;
