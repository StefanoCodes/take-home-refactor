'use client';

import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/server-actions/auth/logout';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const [_prevState, formAction, isPending] = useActionState(async () => {
    const result = await logoutAction();
    const { data: payload, serverError } = result;

    if (serverError || !payload?.success) {
      toast.error(payload?.message ?? serverError ?? 'Failed to logout');
      return;
    }

    toast.success(payload.message);
    router.push('/login');
  }, undefined);

  return (
    <form action={formAction}>
      <Button
        type="submit"
        disabled={isPending}
        className="rounded bg-gray-600 px-3 py-1.5 text-sm text-white hover:bg-gray-500 disabled:opacity-50"
      >
        {isPending && <Loader2 className="mr-1 inline size-3.5 animate-spin" />}
        {isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </form>
  );
}
