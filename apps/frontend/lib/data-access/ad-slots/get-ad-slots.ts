import "server-only";

import { $fetch } from "@/lib/api-client";
import type { ListAdSlotsOutput } from "@anvara/schemas";

export async function getAdSlots(): Promise<ListAdSlotsOutput> {
	const { data, error } = await $fetch("@get/api/ad-slots", {
		query: {},
	});

	if (error) {
		return [];
	}

	return data;
}
