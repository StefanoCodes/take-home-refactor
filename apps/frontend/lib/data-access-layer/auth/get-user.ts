import 'server-only';

import { $fetch } from '@/lib/api-client';
import type { GetMeOutput } from '@anvara/schemas';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getAuthHeaders } from '@/lib/data-access-layer/auth-headers';
import { redirect } from 'next/navigation';

export async function getUser(): Promise<GetMeOutput | null> {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) redirect('/login');

  const authHeaders = await getAuthHeaders();
  const { data, error } = await $fetch('@get/api/auth/me', {
    ...(authHeaders && { headers: authHeaders }),
  });

  if (error) {
    return null;
  }

  return data;
}
