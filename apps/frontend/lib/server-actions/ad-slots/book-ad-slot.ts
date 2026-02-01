"use server";

import { authActionClient, ActionError } from "@/lib/action-client";
import { $fetch } from "@/lib/api-client";
import { bookAdSlotSchema } from "@/components/dashboard/marketplace/marketplace-listing/book-ad-slot-form";

export const bookAdSlotAction = authActionClient
	.metadata({
		actionName: "bookAdSlot",
		actionDescription: "Book an ad slot placement as a sponsor",
	})
	.inputSchema(bookAdSlotSchema)
	.action(async ({ parsedInput }) => {
		const { adSlotId, sponsorId, message } = parsedInput;

		const { data, error } = await $fetch("@post/api/ad-slots/:id/book", {
			params: { id: adSlotId },
			body: {
				sponsorId,
				message,
			},
		});

		if (error) {
			throw new ActionError(error.error ?? "Failed to book placement");
		}

		return {
			success: true,
			message: data.message,
		};
	});
