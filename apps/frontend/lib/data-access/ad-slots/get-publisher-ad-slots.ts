import "server-only";

import { $fetch } from "@/lib/api-client";
import type { ListAdSlotsOutput } from "@anvara/schemas";

export async function getPublisherAdSlots(publisherId: string): Promise<ListAdSlotsOutput> {
	const { data, error } = await $fetch("@get/api/ad-slots", {
		query: { publisherId },
	});

	if (error) {
		return [];
	}

	return data;
}
