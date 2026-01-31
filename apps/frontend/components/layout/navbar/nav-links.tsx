'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type UserRole = 'sponsor' | 'publisher' | null;

const sharedLinks = [{ href: '/marketplace', label: 'Marketplace' }] as const;

const roleLinks: Record<string, { href: string; label: string }> = {
  sponsor: { href: '/dashboard/sponsor', label: 'My Campaigns' },
  publisher: { href: '/dashboard/publisher', label: 'My Ad Slots' },
};

export function NavLinks({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <>
      {sharedLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? 'text-[--color-foreground] font-medium'
              : 'text-[--color-muted] hover:text-[--color-foreground]'
          }
        >
          {link.label}
        </Link>
      ))}

      {role && roleLinks[role] && (
        <Link
          href={roleLinks[role].href}
          className={
            pathname === roleLinks[role].href
              ? 'text-[--color-foreground] font-medium'
              : 'text-[--color-muted] hover:text-[--color-foreground]'
          }
        >
          {roleLinks[role].label}
        </Link>
      )}
    </>
  );
}
