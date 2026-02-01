import "server-only";

import { $fetch } from "@/lib/api-client";
import type { GetMeOutput } from "@anvara/schemas";

export async function getUser(): Promise<GetMeOutput | null> {
	const { data, error } = await $fetch("@get/api/auth/me");
	if (error) {
		return null;
	}

	return data;
}
