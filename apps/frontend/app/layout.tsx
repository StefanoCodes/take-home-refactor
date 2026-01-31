import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Nav } from '@/components/layout/navbar/nav';

// TODO: Add ErrorBoundary wrapper for graceful error handling
// TODO: Consider adding a loading.tsx for Suspense boundaries
// TODO: Add Open Graph metadata for social media sharing
// TODO: Add Twitter Card metadata
// TODO: Consider adding favicon and app icons

export const metadata: Metadata = {
  title: 'Anvara Marketplace',
  description: 'Sponsorship marketplace connecting sponsors with publishers',
  // Missing: openGraph, twitter, icons, viewport, etc.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <Nav />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
