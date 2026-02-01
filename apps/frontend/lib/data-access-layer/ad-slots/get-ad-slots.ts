import "server-only";

import { $fetch } from "@/lib/api-client";
import { isAuthenticated } from "@/lib/auth-helpers.server";
import type { ListAdSlotsOutput } from "@anvara/schemas";
import { redirect } from "next/navigation";

export async function getAdSlots(): Promise<ListAdSlotsOutput> {
	const { isLoggedIn } = await isAuthenticated();

	if (!isLoggedIn) redirect("/login");

	const { data, error } = await $fetch("@get/api/ad-slots", {
		query: {},
	});

	if (error) {
		return [];
	}

	return data;
}
