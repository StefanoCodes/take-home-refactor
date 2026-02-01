'use client';

import { Button } from '@/components/ui/button';
import { unbookAdSlotAction } from '@/lib/server-actions/ad-slots/unbook-ad-slot';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface Props {
  adSlotId: string;
  label?: string;
}

export function UnbookAdSlotButton({ adSlotId, label = 'Reset listing' }: Props) {
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
    <Button type="button" onClick={handleUnbook} disabled={isPending} className="w-full py-3">
      {isPending ? 'Resetting...' : label}
      {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
    </Button>
  );
}
