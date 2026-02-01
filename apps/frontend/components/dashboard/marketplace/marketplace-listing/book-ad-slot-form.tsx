'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { bookAdSlotAction } from '@/lib/server-actions/ad-slots/book-ad-slot';
import { bookAdSlotSchema, type BookAdSlotSchemaType } from '@/lib/validations/ad-slots';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  adSlotId: string;
  sponsorId: string;
  sponsorName: string;
}

export function BookAdSlotForm({ adSlotId, sponsorId, sponsorName }: Props) {
  const router = useRouter();

  const form = useForm<BookAdSlotSchemaType>({
    resolver: zodResolver(bookAdSlotSchema),
    defaultValues: {
      adSlotId,
      sponsorId,
      message: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: BookAdSlotSchemaType) => {
    try {
      const result = await bookAdSlotAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to book placement');
      }

      toast.success(payload.message);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to book placement');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-text-muted">
            Your Company
          </label>
          <p className="text-foreground">{sponsorName}</p>
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-text-muted">Message to Publisher (optional)</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Tell the publisher about your campaign goals..."
                  className="w-full rounded-lg border border-white/[0.08] bg-background px-3 py-2 text-foreground placeholder:text-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full py-3" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isPending ? 'Booking...' : 'Book This Placement'}
        </Button>
      </form>
    </Form>
  );
}
