'use client';

import type { UserRole } from '@anvara/schemas';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { LogoutButton } from './logout-button';

const sharedLinks = [{ href: '/marketplace', label: 'Marketplace' }] as const;

const roleLinks: Record<string, { href: string; label: string }[]> = {
  sponsor: [{ href: '/dashboard/sponsor', label: 'My Campaigns' }],
  publisher: [
    { href: '/dashboard/publisher', label: 'My Ad Slots' },
    { href: '/dashboard/publisher/quotes', label: 'Quote Requests' },
  ],
};

interface MobileNavProps {
  role: UserRole;
  user: { name: string } | null;
  isLoggedIn: boolean;
}

export function MobileNav({ role, user, isLoggedIn }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allLinks = [...sharedLinks, ...(role && roleLinks[role] ? roleLinks[role] : [])];

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-text-muted hover:bg-brand-primary/10"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 right-0 top-full overflow-hidden border-b border-border bg-background"
          >
            <div className="flex flex-col gap-2 p-4">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-sm ${
                      pathname === link.href
                        ? 'bg-brand-primary/10 font-medium text-brand-primary'
                        : 'text-text-muted hover:bg-brand-primary/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <hr className="my-2 border-border" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: allLinks.length * 0.05 }}
                className="flex items-center justify-between px-3"
              >
                {isLoggedIn && user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">
                      {user.name} {role && `(${role})`}
                    </span>
                    <LogoutButton />
                  </div>
                ) : (
                  <Button asChild variant="primary" className="px-4 py-2 text-sm">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
                <ModeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
