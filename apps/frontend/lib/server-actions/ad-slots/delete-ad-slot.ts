'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { deleteAdSlotSchema } from '@/lib/validations/ad-slots';

export const deleteAdSlotAction = authActionClient
  .metadata({
    actionName: 'deleteAdSlot',
    actionDescription: 'Delete an ad slot',
  })
  .inputSchema(deleteAdSlotSchema)
  .action(async ({ parsedInput }) => {
    const { adSlotId } = parsedInput;
    const authHeaders = await withAuthHeaders();

    const { error } = await $fetch('@delete/api/ad-slots/:id', {
      params: { id: adSlotId },
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to delete ad slot');
    }

    revalidatePath('/dashboard/publisher');
    return {
      success: true,
      message: 'Ad slot deleted successfully',
    };
  });
