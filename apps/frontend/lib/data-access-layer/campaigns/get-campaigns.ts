import 'server-only';

import { $fetch } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import type { ListCampaignsOutput } from '@anvara/schemas';
import { redirect } from 'next/navigation';

export async function getCampaigns(sponsorId: string): Promise<ListCampaignsOutput | null> {
  const { isLoggedIn } = await isAuthenticated();
  if (!isLoggedIn) redirect('/login');

  const { data, error } = await $fetch('@get/api/campaigns', {
    query: { sponsorId },
  });

  if (error) {
    return null;
  }

  return data;
}
