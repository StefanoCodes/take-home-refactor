import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Nav } from '@/components/layout/navbar/nav';
import localFont from 'next/font/local';
import { GoogleTagManager } from '@next/third-parties/google';
import { Providers } from '@/components/providers/providers';

const neueHaas = localFont({
  src: '../public/fonts/NHaasGroteskDSStd-55Rg.otf',
  variable: '--font-neue-haas',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Anvara Marketplace',
  description: 'Sponsorship marketplace connecting sponsors with publishers',
  openGraph: {
    type: 'website',
    title: 'Anvara Marketplace',
    description: 'Sponsorship marketplace connecting sponsors with publishers',
    images: [
      {
        url: 'https://framerusercontent.com/assets/gdGdP54HWW02IP0vYlZ9RpJTU.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara Marketplace',
    description: 'Sponsorship marketplace connecting sponsors with publishers',
    images: ['https://framerusercontent.com/assets/gdGdP54HWW02IP0vYlZ9RpJTU.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleTagManager gtmId="G-NWHC9C48N5" />
      <body className={`min-h-dvh pt-(--navbar-height)! antialiased ${neueHaas.variable}`}>
        <Providers>
          <Nav />
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
