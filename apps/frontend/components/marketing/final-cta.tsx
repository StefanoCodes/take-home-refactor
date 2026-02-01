import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
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
  );
}
