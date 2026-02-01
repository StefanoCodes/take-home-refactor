import "server-only";

import { $fetch } from "@/lib/api-client";
import { isAuthenticated } from "@/lib/auth-helpers.server";
import type { AdSlotListItem } from "@anvara/schemas";
import { redirect } from "next/navigation";

export async function getPublisherAdSlots(
	publisherId: string,
): Promise<AdSlotListItem[]> {
	const { isLoggedIn } = await isAuthenticated();

	if (!isLoggedIn) redirect("/login");

	const { data, error } = await $fetch("@get/api/ad-slots", {
		query: { publisherId, limit: 50 },
	});

	if (error) {
		return [];
	}

	return data.data;
}
