import "server-only";

import { $fetch } from "@/lib/api-client";
import { isAuthenticated } from "@/lib/auth-helpers.server";
import type { QuoteRequest } from "@anvara/schemas";
import { redirect } from "next/navigation";

export async function getUserQuoteForSlot(
	adSlotId: string,
): Promise<QuoteRequest | null> {
	const { isLoggedIn } = await isAuthenticated();
	if (!isLoggedIn) redirect("/login");

	const { data, error } = await $fetch("@get/api/quotes/mine", {
		query: { adSlotId },
	});

	if (error || !data?.data?.length) {
		return null;
	}

	return data.data[0];
}
