import 'server-only';

import { $fetch } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import type { ListAdSlotsOutput, AdSlotType } from '@anvara/schemas';
import { getAuthHeaders } from '@/lib/data-access-layer/auth-headers';
import { redirect } from 'next/navigation';

interface GetAdSlotsParams {
  page?: number;
  limit?: number;
  type?: string;
  available?: string;
}

export async function getAdSlots(params: GetAdSlotsParams = {}): Promise<ListAdSlotsOutput> {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) redirect('/login');

  const authHeaders = await getAuthHeaders();
  const { data, error } = await $fetch('@get/api/ad-slots', {
    query: {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit }),
      ...(params.type && { type: params.type as AdSlotType }),
      ...(params.available && { available: params.available }),
    },
    ...(authHeaders && { headers: authHeaders }),
  });

  if (error) {
    return {
      data: [],
      pagination: {
        page: params.page ?? 1,
        limit: params.limit ?? 6,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    };
  }

  return data;
}
