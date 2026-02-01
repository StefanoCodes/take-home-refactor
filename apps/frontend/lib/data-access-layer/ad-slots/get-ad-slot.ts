import "server-only";

import { $fetch } from "@/lib/api-client";
import { isAuthenticated } from "@/lib/auth-helpers.server";
import type { GetAdSlotOutput } from "@anvara/schemas";
import { redirect } from "next/navigation";

export async function getAdSlot(id: string): Promise<GetAdSlotOutput | null> {
	const { isLoggedIn } = await isAuthenticated();
	if (!isLoggedIn) redirect("/login");

	const { data, error } = await $fetch("@get/api/ad-slots/:id", {
		params: { id },
	});

	if (error) {
		return null;
	}

	return data;
}
