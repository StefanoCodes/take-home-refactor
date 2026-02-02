import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Anvara. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/login" className="transition-colors hover:text-foreground">
            Login
          </Link>
          <Link href="/marketplace" className="transition-colors hover:text-foreground">
            Marketplace
          </Link>
        </div>
      </div>
    </footer>
  );
}
