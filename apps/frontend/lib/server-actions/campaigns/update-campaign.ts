'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { updateCampaignFormSchema } from '@/lib/validations/campaigns';

export const updateCampaignAction = authActionClient
  .metadata({
    actionName: 'updateCampaign',
    actionDescription: 'Update an existing campaign',
  })
  .inputSchema(updateCampaignFormSchema)
  .action(async ({ parsedInput }) => {
    const { campaignId, ...body } = parsedInput;

    const { data, error } = await $fetch('@put/api/campaigns/:id', {
      params: { id: campaignId },
      body,
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to update campaign');
    }

    revalidatePath('/dashboard/sponsor');
    return {
      success: true,
      message: 'Campaign updated successfully',
      campaign: data,
    };
  });
