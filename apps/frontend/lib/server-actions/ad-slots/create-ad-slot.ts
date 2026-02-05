'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { createAdSlotInputSchema } from '@/lib/validations/ad-slots';

export const createAdSlotAction = authActionClient
  .metadata({
    actionName: 'createAdSlot',
    actionDescription: 'Create a new ad slot for the publisher',
  })
  .inputSchema(createAdSlotInputSchema)
  .action(async ({ parsedInput }) => {
    const authHeaders = await withAuthHeaders();
    const { data, error } = await $fetch('@post/api/ad-slots', {
      body: parsedInput,
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to create ad slot');
    }

    revalidatePath('/dashboard/publisher');
    return {
      success: true,
      message: 'Ad slot created successfully',
      adSlot: data,
    };
  });
