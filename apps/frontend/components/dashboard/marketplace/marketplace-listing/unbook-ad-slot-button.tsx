'use client';

import { unbookAdSlotAction } from '@/lib/server-actions/ad-slots/unbook-ad-slot';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface Props {
  adSlotId: string;
  label?: string;
  className?: string;
}

export function UnbookAdSlotButton({ adSlotId, label = 'Reset listing', className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUnbook = () => {
    startTransition(async () => {
      try {
        const result = await unbookAdSlotAction({ adSlotId });
        const { data: payload, serverError } = result;

        if (serverError || !payload?.success) {
          toast.error(payload?.message ?? serverError ?? 'Failed to reset booking');
          return;
        }

        toast.success(payload.message);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to reset booking');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleUnbook}
      disabled={isPending}
      className={
        className ?? 'text-sm text-[--color-primary] underline hover:opacity-80 disabled:opacity-50'
      }
    >
      {isPending ? 'Resetting...' : label}
    </button>
  );
}
