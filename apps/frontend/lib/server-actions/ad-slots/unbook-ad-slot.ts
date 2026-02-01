"use server";

import { authActionClient, ActionError } from "@/lib/action-client";
import { $fetch } from "@/lib/api-client";
import { unbookAdSlotSchema } from "@/lib/validations/ad-slots";

export const unbookAdSlotAction = authActionClient
	.metadata({
		actionName: "unbookAdSlot",
		actionDescription: "Remove a booking from an ad slot (reset for testing)",
	})
	.inputSchema(unbookAdSlotSchema)
	.action(async ({ parsedInput }) => {
		const { adSlotId } = parsedInput;

		const { data, error } = await $fetch("@post/api/ad-slots/:id/unbook", {
			params: { id: adSlotId },
		});

		if (error) {
			throw new ActionError(error.error ?? "Failed to reset booking");
		}

		return {
			success: true,
			message: data.message,
		};
	});
