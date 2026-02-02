import { FinalCta } from '@/components/layout/cta/final-cta';
import { Audiences } from '@/components/marketing/audiences';
import { Features } from '@/components/marketing/features';
import { Hero } from '@/components/marketing/hero';
import { HowItWorks } from '@/components/marketing/how-it-works';
import { NewsletterSignup } from '@/components/marketing/newsletter-signup';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anvara — The Sponsorship Marketplace',
  description:
    'Connect sponsors with premium publishers. Create campaigns, set budgets, and reach your target audience through curated ad placements.',
  openGraph: {
    title: 'Anvara — The Sponsorship Marketplace',
    description:
      'Connect sponsors with premium publishers. Create campaigns, set budgets, and reach your target audience through curated ad placements.',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Audiences />
      <NewsletterSignup />
      <FinalCta />
    </>
  );
}
