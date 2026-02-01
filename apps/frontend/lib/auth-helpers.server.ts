import "server-only";
import { auth } from "@/lib/auth-client.server";
import { headers } from "next/headers";
import { cache } from "react";
// cache will memoize the result of the function for the render pass so its not a cache but rather a memoization cache so if in the render pass there are multiple components calling this same function the first result will resolve and be used rather than having multiple callls (perfromance boost)
export const isAuthenticated = cache(async () => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		return {
			isLoggedIn: !!session,
			session: session?.session,
			user: session?.user,
		};
	} catch {
		return {
			isLoggedIn: false,
			session: null,
			user: null,
		};
	}
});
