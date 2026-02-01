import { betterAuth } from "better-auth";
import { Pool } from "pg";
import type { Request } from "express";

/**
 * Better Auth instance for session validation.
 * Shares the same database and secret as the frontend instance.
 */
export const auth = betterAuth({
	database: new Pool({ connectionString: process.env.DATABASE_URL }),
	secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-dev",
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: [process.env.BETTER_AUTH_URL!],
});
