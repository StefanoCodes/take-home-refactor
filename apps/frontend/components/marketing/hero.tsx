import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden px-6 pt-12 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.12] blur-[120px] dark:bg-blue-500/[0.04]" />

      <h1 className="text-hero mx-auto max-w-3xl text-foreground">
        The sponsorship marketplace for modern brands
      </h1>

      <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Connect with premium publishers. Book ad placements across newsletters, podcasts, display,
        and video — all in one place.
      </p>

      <div className="mt-10 flex items-center gap-4">
        <Button asChild variant="primary" className="px-7 py-3 text-sm">
          <Link href="/login">Get Started</Link>
        </Button>
        <Link
          href="#how-it-works"
          className="rounded-xl border border-border px-7 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          How It Works
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="h-8 w-5 rounded-full border border-border p-1">
          <div className="mx-auto h-1.5 w-1 animate-bounce rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
