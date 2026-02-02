'use server';

import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateQuoteStatusInputSchema } from '@/lib/validations/quotes';

const inputSchema = updateQuoteStatusInputSchema.extend({
  quoteId: z.string().min(1),
});

export const updateQuoteStatusAction = authActionClient
  .metadata({
    actionName: 'updateQuoteStatus',
    actionDescription: 'Update quote request status',
  })
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { quoteId, status } = parsedInput;

    const { data, error } = await $fetch('@patch/api/quotes/:id/status', {
      params: { id: quoteId },
      body: { status },
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to update quote status');
    }

    revalidatePath('/dashboard/publisher/quotes');

    return {
      success: true,
      message: data.message,
    };
  });
