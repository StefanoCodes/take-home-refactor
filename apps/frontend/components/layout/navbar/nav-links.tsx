'use client';

import type { UserRole } from '@anvara/schemas';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
              ? 'text-foreground font-medium'
              : 'text-text-muted hover:text-foreground transition-colors'
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
              ? 'text-foreground font-medium'
              : 'text-text-muted hover:text-foreground transition-colors'
          }
        >
          {roleLinks[role].label}
        </Link>
      )}
    </>
  );
}
