"use server";

import { auth } from "@/lib/auth.server";
import { actionClient, ActionError } from "@/lib/action-client";
import { getUserRole } from "@/lib/data-access-layer/auth/get-user-role";
import { loginSchema } from "@/lib/validations/auth";
import { headers } from "next/headers";

const CREDENTIALS = {
	sponsor: { email: "sponsor@example.com", password: "password" },
	publisher: { email: "publisher@example.com", password: "password" },
} as const;

export const loginAction = actionClient
	.metadata({
		actionName: "login",
		actionDescription: "Sign in with role-based credentials",
	})
	.inputSchema(loginSchema)
	.action(async ({ parsedInput }) => {
		const { role } = parsedInput;
		const { email, password } = CREDENTIALS[role];

		try {
			const response = await auth.api.signInEmail({
				body: { email, password },
				headers: await headers(),
				asResponse: true,
			});

			if (!response.ok) {
				throw new ActionError("Invalid credentials");
			}

			const data = await response.json();
			const userId = data?.user?.id;

			if (!userId) {
				throw new ActionError("Login succeeded but no user ID returned");
			}

			const roleData = await getUserRole(userId);

			let redirectTo = "/";
			if (roleData.role === "sponsor") {
				redirectTo = "/dashboard/sponsor";
			} else if (roleData.role === "publisher") {
				redirectTo = "/dashboard/publisher";
			}

			return {
				success: true,
				message: "Login successful",
				redirectTo,
			};
		} catch (error) {
			if (error instanceof ActionError) throw error;
			throw new ActionError(
				error instanceof Error
					? error.message
					: "An error occurred during login",
			);
		}
	});
