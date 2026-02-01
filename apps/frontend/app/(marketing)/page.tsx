import type { Metadata } from 'next';
import { Hero, Features, HowItWorks, Audiences, FinalCta } from '@/components/marketing';

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
      <FinalCta />
    </>
  );
}
