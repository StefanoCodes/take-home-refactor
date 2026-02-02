'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeNewsletterAction } from '@/lib/server-actions/newsletter/subscribe';
import {
  subscribeNewsletterInputSchema,
  type SubscribeNewsletterSchemaType,
} from '@/lib/validations/newsletter';

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);

  const form = useForm<SubscribeNewsletterSchemaType>({
    resolver: zodResolver(subscribeNewsletterInputSchema),
    defaultValues: { email: '' },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: SubscribeNewsletterSchemaType) => {
    try {
      const result = await subscribeNewsletterAction(data);
      const { data: payload, serverError } = result;

      if (serverError || !payload?.success) {
        return toast.error(payload?.message ?? serverError ?? 'Failed to subscribe');
      }

      setSubscribed(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to subscribe');
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="rounded-2xl border border-border bg-gradient-to-b from-foreground/[0.03] to-transparent p-8 text-center shadow-sm sm:p-12 dark:primary-card-shadow">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Stay in the loop
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Get the latest updates on new publishers, platform features, and sponsorship tips
          delivered to your inbox.
        </p>

        {subscribed ? (
          <p className="mt-8 text-sm font-medium text-emerald-500 dark:text-emerald-400/90">
            Thanks for subscribing! We&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              placeholder="you@company.com"
              {...form.register('email')}
              className="flex-1 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Subscribe
              {isPending && <Loader2 className="size-4 animate-spin" />}
            </button>
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 dark:text-red-400 sm:hidden">
                {form.formState.errors.email.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
