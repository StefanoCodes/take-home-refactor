'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { requestQuoteAction } from '@/lib/server-actions/quotes/request-quote';
import {
  requestQuoteInputSchema,
  type RequestQuoteSchemaType,
} from '@/lib/validations/quotes';
import type { QuoteRequest } from '@anvara/schemas';
import { Clock } from 'lucide-react';

interface Props {
  adSlotId: string;
  userEmail?: string;
  existingQuote?: QuoteRequest | null;
}

export function RequestQuoteButton({ adSlotId, userEmail, existingQuote }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<RequestQuoteSchemaType>({
    resolver: zodResolver(requestQuoteInputSchema),
    defaultValues: {
      companyName: '',
      email: userEmail ?? '',
      phone: '',
      message: '',
      adSlotId,
    },
  });

  const isPending = form.formState.isSubmitting;

  if (existingQuote) {
    return (
      <div className="space-y-2">
        <Button
          variant="secondary"
          className="w-full rounded-xl px-4 py-3 font-semibold"
          disabled
        >
          <Clock className="mr-2 size-4" />
          Quote Requested
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          We&apos;ll get back to you within 24 hours
        </p>
      </div>
    );
  }

  const onSubmit = async (data: RequestQuoteSchemaType) => {
    try {
      const result = await requestQuoteAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to submit quote request');
      }

      toast.success("Quote request submitted! We'll respond within 24 hours.");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit quote request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full rounded-xl px-4 py-3 font-semibold"
        >
          Request a Quote
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and we&apos;ll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder="Acme Inc."
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="email"
                      placeholder="you@company.com"
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optional)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Tell us about your sponsorship needs..."
                      className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Submitting...' : 'Submit Quote Request'}
              {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
