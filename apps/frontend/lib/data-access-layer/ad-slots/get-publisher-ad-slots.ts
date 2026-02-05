import 'server-only';

import { $fetch } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import type { AdSlotListItem } from '@anvara/schemas';
import { getAuthHeaders } from '@/lib/data-access-layer/auth-headers';
import { redirect } from 'next/navigation';

export async function getPublisherAdSlots(publisherId: string): Promise<AdSlotListItem[]> {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) redirect('/login');

  const authHeaders = await getAuthHeaders();
  const { data, error } = await $fetch('@get/api/ad-slots', {
    query: { publisherId, limit: 50 },
    ...(authHeaders && { headers: authHeaders }),
  });

  if (error) {
    return [];
  }

  return data.data;
}
