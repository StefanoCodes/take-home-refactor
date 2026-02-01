import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Anvara — The Sponsorship Marketplace',
  description:
    'Connect sponsors with premium publishers. Create campaigns, set budgets, and reach your target audience through curated ad placements.',
  openGraph: {
    title: 'Anvara — The Sponsorship Marketplace',
    description:
      'Connect sponsors with premium publishers. Create campaigns, set budgets, and reach your target audience through curated ad placements.',
  },
};

const features = [
  {
    title: 'Curated Placements',
    description:
      'Browse a vetted marketplace of premium ad slots across newsletters, podcasts, display, and video.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    description:
      'Every listing shows clear monthly rates. No hidden fees, no bidding wars — just straightforward sponsorship deals.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Campaign Management',
    description:
      'Track your active placements, manage budgets, and monitor performance from a single dashboard.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 5 5-9" />
      </svg>
    ),
  },
  {
    title: 'Publisher Tools',
    description:
      'List your inventory, set your own rates, and receive booking requests directly from qualified sponsors.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.855z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: '01',
    title: 'Browse the Marketplace',
    description: 'Explore ad slots from verified publishers across multiple formats and niches.',
  },
  {
    number: '02',
    title: 'Request a Placement',
    description: 'Found the right fit? Send a booking request with an optional message to the publisher.',
  },
  {
    number: '03',
    title: 'Launch & Track',
    description: 'Once approved, manage your active placements and track results from your dashboard.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] flex-col items-center justify-center px-6 pt-12 text-center">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[120px]" />

        <h1 className="text-hero mx-auto max-w-3xl text-white/90">
          The sponsorship marketplace for modern brands
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/40">
          Connect with premium publishers. Book ad placements across newsletters, podcasts, display, and video — all in one place.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Button asChild variant="primary" className="px-7 py-3 text-sm">
            <Link href="/login">Get Started</Link>
          </Button>
          <Link
            href="#how-it-works"
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-7 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/[0.12] hover:text-white/80"
          >
            How It Works
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="h-8 w-5 rounded-full border border-white/[0.12] p-1">
            <div className="mx-auto h-1.5 w-1 animate-bounce rounded-full bg-white/30" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white/85">
            Everything you need to run sponsorships
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/35">
            Whether you&apos;re a sponsor looking for reach or a publisher monetizing your audience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 primary-card-shadow transition-all duration-200 hover:border-white/[0.12] hover:from-white/[0.08] hover:to-white/[0.03]"
            >
              <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.05] p-3 text-white/50 transition-colors group-hover:text-white/70">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-white/85">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/35">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white/85">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/35">
            Get from browsing to booked in three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-7">
              <span className="mb-4 block text-3xl font-bold tracking-tight text-white/[0.08]">
                {step.number}
              </span>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-white/80">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/35">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* For Sponsors / For Publishers */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-blue-500/[0.06] to-transparent p-8 primary-card-shadow">
            <div className="mb-4 inline-flex rounded-full bg-blue-400/10 px-3 py-1 text-xs font-medium tracking-wide text-blue-300 uppercase ring-1 ring-blue-400/20">
              Sponsors
            </div>
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-white/85">
              Reach the right audience
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/35">
              Create campaigns, set budgets, and place your brand in front of engaged audiences through premium publishers. Browse available placements by format, niche, and price.
            </p>
            <ul className="space-y-3 text-sm text-white/45">
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
                Browse curated ad placements
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
                Transparent monthly pricing
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-blue-400/60" />
                Campaign dashboard & tracking
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-8 primary-card-shadow">
            <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300 uppercase ring-1 ring-emerald-400/20">
              Publishers
            </div>
            <h3 className="mb-3 text-xl font-semibold tracking-tight text-white/85">
              Monetize your audience
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/35">
              List your ad slots, set your own rates, and receive booking requests from qualified sponsors. Manage everything from a simple publisher dashboard.
            </p>
            <ul className="space-y-3 text-sm text-white/45">
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
                List multiple ad slot formats
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
                Set your own monthly rates
              </li>
              <li className="flex items-center gap-2.5">
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
                Manage bookings & availability
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
        </div>

        <div className="relative text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white/85">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/35">
            Join the marketplace and start connecting with sponsors and publishers today.
          </p>
          <div className="mt-10">
            <Button asChild variant="primary" className="px-8 py-3.5 text-base">
              <Link href="/login">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/25">&copy; {new Date().getFullYear()} Anvara. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/25">
            <Link href="/login" className="transition-colors hover:text-white/50">Login</Link>
            <Link href="/marketplace" className="transition-colors hover:text-white/50">Marketplace</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
