import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[75vh] flex-col items-center justify-center px-6 pt-12 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[120px]" />

      <h1 className="text-hero mx-auto max-w-3xl text-white/90">
        The sponsorship marketplace for modern brands
      </h1>

      <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/40">
        Connect with premium publishers. Book ad placements across newsletters, podcasts, display,
        and video — all in one place.
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
  );
}
