'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { QuoteStatus } from '@anvara/schemas';
import { updateQuoteStatusAction } from '@/lib/server-actions/quotes/update-quote-status';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusOptions: { value: QuoteStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'RESPONDED', label: 'Responded' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'DECLINED', label: 'Declined' },
];

interface Props {
  quoteId: string;
  currentStatus: QuoteStatus;
}

export function QuoteStatusActions({ quoteId, currentStatus }: Props) {
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      const result = await updateQuoteStatusAction({
        quoteId,
        status: newStatus as QuoteStatus,
      });

      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        toast.error(payload?.message ?? serverError ?? 'Failed to update status');
        return;
      }

      toast.success(payload.message);
      router.refresh();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="h-8 w-[130px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
