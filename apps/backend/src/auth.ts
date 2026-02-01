import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

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
	plugins: [nextCookies()],
	trustedOrigins: [process.env.BETTER_AUTH_URL!],
});
