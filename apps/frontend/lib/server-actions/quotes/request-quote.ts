"use server";

import { authActionClient, ActionError } from "@/lib/action-client";
import { $fetch } from "@/lib/api-client";
import { revalidatePath } from "next/cache";
import { requestQuoteInputSchema } from "@/lib/validations/quotes";

export const requestQuoteAction = authActionClient
	.metadata({
		actionName: "requestQuote",
		actionDescription: "Request a quote for an ad slot",
	})
	.inputSchema(requestQuoteInputSchema)
	.action(async ({ parsedInput }) => {
		const { companyName, email, phone, message, adSlotId } = parsedInput;

		const { data, error } = await $fetch("@post/api/quotes", {
			body: { companyName, email, phone, message, adSlotId },
		});

		if (error) {
			throw new ActionError(error.error ?? "Failed to submit quote request");
		}

		revalidatePath(`/marketplace/${adSlotId}`);

		return {
			success: true,
			message: data.message,
			quoteId: data.quoteId,
		};
	});
