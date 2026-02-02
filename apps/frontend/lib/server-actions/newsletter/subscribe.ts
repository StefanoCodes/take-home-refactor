'use server';

import { actionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { subscribeNewsletterInputSchema } from '@/lib/validations/newsletter';

export const subscribeNewsletterAction = actionClient
  .metadata({
    actionName: 'subscribeNewsletter',
    actionDescription: 'Subscribe to the newsletter',
  })
  .inputSchema(subscribeNewsletterInputSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const { data, error } = await $fetch('@post/api/newsletter', {
      body: { email },
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to subscribe');
    }

    return {
      success: true,
      message: data.message,
    };
  });
