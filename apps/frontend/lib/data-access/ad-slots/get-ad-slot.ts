import "server-only";

import { $fetch } from "@/lib/api-client";
import type { GetAdSlotOutput } from "@anvara/schemas";

export async function getAdSlot(id: string): Promise<GetAdSlotOutput | null> {
	const { data, error } = await $fetch("@get/api/ad-slots/:id", {
		params: { id },
	});

	if (error) {
		return null;
	}

	return data;
}
