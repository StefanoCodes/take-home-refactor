import { Nav } from '../../components/nav';

// TODO: Add a marketing-specific footer component
// TODO: Add a banner or announcement bar
// TODO: Consider adding a CTA section above the footer

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </>
  );
}
