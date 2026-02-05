'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { withAuthHeaders } from '@/lib/server-actions/with-auth-headers';
import { createCampaignInputSchema } from '@/lib/validations/campaigns';

export const createCampaignAction = authActionClient
  .metadata({
    actionName: 'createCampaign',
    actionDescription: 'Create a new campaign for the sponsor',
  })
  .inputSchema(createCampaignInputSchema)
  .action(async ({ parsedInput }) => {
    const authHeaders = await withAuthHeaders();
    const { data, error } = await $fetch('@post/api/campaigns', {
      body: parsedInput,
      ...authHeaders,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to create campaign');
    }

    revalidatePath('/dashboard/sponsor');
    return {
      success: true,
      message: 'Campaign created successfully',
      campaign: data,
    };
  });
