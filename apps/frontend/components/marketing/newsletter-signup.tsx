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
      <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center primary-card-shadow sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-white/85 sm:text-3xl">
          Stay in the loop
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/35">
          Get the latest updates on new publishers, platform features, and sponsorship tips
          delivered to your inbox.
        </p>

        {subscribed ? (
          <p className="mt-8 text-sm font-medium text-emerald-400/90">
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
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 placeholder:text-white/25 focus:border-white/15 focus:outline-none focus:ring-1 focus:ring-white/10"
            />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/[0.08] transition-colors hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Subscribe
              {isPending && <Loader2 className="size-4 animate-spin" />}
            </button>
            {form.formState.errors.email && (
              <p className="text-xs text-red-400 sm:hidden">
                {form.formState.errors.email.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
