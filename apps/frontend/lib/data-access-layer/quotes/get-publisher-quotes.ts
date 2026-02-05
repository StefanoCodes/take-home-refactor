import 'server-only';

import { $fetch } from '@/lib/api-client';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import type { PublisherQuoteRequest } from '@anvara/schemas';
import { getAuthHeaders } from '@/lib/data-access-layer/auth-headers';
import { redirect } from 'next/navigation';

export async function getPublisherQuotes(): Promise<PublisherQuoteRequest[]> {
  const { isLoggedIn } = await isAuthenticated();
  if (!isLoggedIn) redirect('/login');

  const authHeaders = await getAuthHeaders();
  const { data, error } = await $fetch('@get/api/quotes', {
    ...(authHeaders && { headers: authHeaders }),
  });

  if (error || !data?.data) {
    return [];
  }

  return data.data;
}
