import 'server-only';

import { $fetch } from '@/lib/api-client';
import type { GetUserRoleOutput } from '@anvara/schemas';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { redirect } from 'next/navigation';

export async function getUserRole(userId: string): Promise<GetUserRoleOutput> {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) redirect('/login');

  const { data, error } = await $fetch('@get/api/auth/role/:userId', {
    params: { userId },
  });

  if (error) {
    return { role: null };
  }

  return data;
}
