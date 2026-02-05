import 'server-only';

import { headers } from 'next/headers';

export async function getAuthHeaders(): Promise<HeadersInit | undefined> {
  try {
    const incomingHeaders = await headers();
    const cookieHeader = incomingHeaders.get('cookie');
    if (!cookieHeader) return undefined;
    return { Cookie: cookieHeader };
  } catch {
    return undefined;
  }
}
