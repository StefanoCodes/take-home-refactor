import "server-only";

import { $fetch } from "@/lib/api-client";
import type { ListCampaignsOutput } from "@anvara/schemas";

export async function getCampaigns(sponsorId: string): Promise<ListCampaignsOutput> {
	const { data, error } = await $fetch("@get/api/campaigns", {
		query: { sponsorId },
	});

	if (error) {
		return [];
	}

	return data;
}
