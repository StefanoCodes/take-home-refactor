'use client';

import { authClient } from '@/lib/auth-client';

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
      }}
      className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500"
    >
      Logout
    </button>
  );
}
