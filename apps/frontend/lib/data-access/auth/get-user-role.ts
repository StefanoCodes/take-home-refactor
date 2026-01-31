import "server-only";

import { $fetch } from "@/lib/api-client";
import type { GetUserRoleOutput } from "@anvara/schemas";

export async function getUserRole(userId: string): Promise<GetUserRoleOutput> {
	const { data, error } = await $fetch("@get/api/auth/role/:userId", {
		params: { userId },
	});

	if (error) {
		return { role: null };
	}

	return data;
}
