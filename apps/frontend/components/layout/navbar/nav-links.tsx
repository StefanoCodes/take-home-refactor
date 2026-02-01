'use client';

import type { UserRole } from '@anvara/schemas';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'motion/react';

const sharedLinks = [{ href: '/marketplace', label: 'Marketplace' }] as const;

const roleLinks: Record<string, { href: string; label: string }> = {
  sponsor: { href: '/dashboard/sponsor', label: 'My Campaigns' },
  publisher: { href: '/dashboard/publisher', label: 'My Ad Slots' },
};

export function NavLinks({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const allLinks = [
    ...sharedLinks,
    ...(role && roleLinks[role] ? [roleLinks[role]] : []),
  ];

  const activeHref = hoveredHref ?? allLinks.find((l) => pathname === l.href)?.href ?? null;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHoveredHref(null)}
    >
      {allLinks.map((link) => {
        const isActive = link.href === activeHref;
        const isCurrentRoute = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onMouseEnter={() => setHoveredHref(link.href)}
            className="relative rounded-md px-3 py-1.5 text-sm transition-colors"
          >
            {isActive && (
              <motion.span
                className="absolute inset-0 rounded-md bg-brand-primary/10"
                layoutId="nav-active-pill"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
            <span
              className={`relative z-10 ${
                isCurrentRoute
                  ? 'font-medium text-brand-primary'
                  : 'text-text-muted'
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
