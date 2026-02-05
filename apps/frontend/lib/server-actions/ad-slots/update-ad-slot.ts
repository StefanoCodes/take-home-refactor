'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { updateAdSlotFormSchema } from '@/lib/validations/ad-slots';

export const updateAdSlotAction = authActionClient
  .metadata({
    actionName: 'updateAdSlot',
    actionDescription: 'Update an existing ad slot',
  })
  .inputSchema(updateAdSlotFormSchema)
  .action(async ({ parsedInput }) => {
    const { adSlotId, ...body } = parsedInput;
    const authHeaders = await withAuthHeaders();

    const { data, error } = await $fetch('@put/api/ad-slots/:id', {
      params: { id: adSlotId },
      body,
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to update ad slot');
    }

    revalidatePath('/dashboard/publisher');
    return {
      success: true,
      message: 'Ad slot updated successfully',
      adSlot: data,
    };
  });
