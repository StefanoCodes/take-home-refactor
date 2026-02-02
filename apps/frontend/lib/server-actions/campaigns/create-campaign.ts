'use server';

import { revalidatePath } from 'next/cache';
import { authActionClient, ActionError } from '@/lib/action-client';
import { $fetch } from '@/lib/api-client';
import { createCampaignInputSchema } from '@/lib/validations/campaigns';

export const createCampaignAction = authActionClient
  .metadata({
    actionName: 'createCampaign',
    actionDescription: 'Create a new campaign for the sponsor',
  })
  .inputSchema(createCampaignInputSchema)
  .action(async ({ parsedInput }) => {
    const { data, error } = await $fetch('@post/api/campaigns', {
      body: parsedInput,
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
