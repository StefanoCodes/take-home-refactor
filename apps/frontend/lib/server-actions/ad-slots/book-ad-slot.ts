'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { bookAdSlotSchema } from '@/lib/validations/ad-slots';

export const bookAdSlotAction = authActionClient
  .metadata({
    actionName: 'bookAdSlot',
    actionDescription: 'Book an ad slot placement as a sponsor',
  })
  .inputSchema(bookAdSlotSchema)
  .action(async ({ parsedInput }) => {
    const { adSlotId, sponsorId, message } = parsedInput;
    const authHeaders = await withAuthHeaders();

    const { data, error } = await $fetch('@post/api/ad-slots/:id/book', {
      params: { id: adSlotId },
      body: {
        sponsorId,
        message,
      },
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to book placement');
    }

    revalidatePath('/dashboard/marketplace');
    return {
      success: true,
      message: data.message,
    };
  });
