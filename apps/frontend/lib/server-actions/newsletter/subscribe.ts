'use server';

import { actionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { subscribeNewsletterInputSchema } from '@/lib/validations/newsletter';

export const subscribeNewsletterAction = actionClient
  .metadata({
    actionName: 'subscribeNewsletter',
    actionDescription: 'Subscribe to the newsletter',
  })
  .inputSchema(subscribeNewsletterInputSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;
    const authHeaders = await withAuthHeaders();

    const { data, error } = await $fetch('@post/api/newsletter', {
      body: { email },
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to subscribe');
    }

    return {
      success: true,
      message: data.message,
    };
  });
