'use server';

import { getAuthHeaders } from '@/lib/data-access-layer/auth-headers';

export async function withAuthHeaders() {
  const authHeaders = await getAuthHeaders();
  return authHeaders ? { headers: authHeaders } : {};
}
