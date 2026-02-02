'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { deleteCampaignSchema } from '@/lib/validations/campaigns';

export const deleteCampaignAction = authActionClient
  .metadata({
    actionName: 'deleteCampaign',
    actionDescription: 'Delete a campaign',
  })
  .inputSchema(deleteCampaignSchema)
  .action(async ({ parsedInput }) => {
    const { campaignId } = parsedInput;

    const { error } = await $fetch('@delete/api/campaigns/:id', {
      params: { id: campaignId },
    });

    if (error) {
      throw new ActionError(error.error ?? 'Failed to delete campaign');
    }

    revalidatePath('/dashboard/sponsor');
    return {
      success: true,
      message: 'Campaign deleted successfully',
    };
  });
