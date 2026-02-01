import { Footer } from '@/components/layout/footer/footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <main>{children}</main>
      <Footer />
    </div>
  );
}
