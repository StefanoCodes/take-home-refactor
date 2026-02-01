import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { Logger } from "./logger";
import { isAuthenticated } from "./auth-helpers.server";

export class ActionError extends Error {}

// Base client (unprotected).
export const actionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
			actionDescription: z.string(),
		});
	},
	handleServerError(e) {
		if (process.env.NODE_ENV === "development") {
			Logger.error("Action error", { message: e.message });
		}

		if (e instanceof ActionError) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	// Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
	Logger.info("Action middleware started", {
		actionName: metadata.actionName,
		actionDescription: metadata.actionDescription,
	});

	const startTime = performance.now();

	// Here we await the action execution.
	const result = await next();

	const endTime = performance.now();

	Logger.info("Action completed", {
		result,
		clientInput,
		metadata,
		executionTime: `${endTime - startTime}ms`,
	});

	// And then return the result of the awaited action.
	return result;
});

// (protected) authentication action, this ensures that the business logic ran has the user authenticated and we pass the user context to the next function.
export const authActionClient = actionClient.use(async ({ next }) => {
	const { isLoggedIn, session, user } = await isAuthenticated();

	if (!isLoggedIn) throw new Error("Unauthorized");

	return next({
		ctx: {
			user: user,
			session: session,
		},
	});
});
