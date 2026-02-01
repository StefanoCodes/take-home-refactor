import { MarketingFooter } from '@/components/marketing';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
