import { Suspense } from 'react';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { AdSlotGrid } from '@/components/dashboard/marketplace/ad-slot-grid';
import { AdSlotGridSkeleton } from '@/components/dashboard/marketplace/ad-slot-grid-skeleton';
import { redirect } from 'next/navigation';

interface MarketplacePageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    type?: string;
    available?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) {
    return redirect('/login');
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 6;
  const type = params.type || undefined;
  const available = params.available || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">Browse available ad slots from our publishers</p>
      </div>
      <Suspense key={`${page}-${limit}-${type}-${available}`} fallback={<AdSlotGridSkeleton />}>
        <AdSlotGrid page={page} limit={limit} type={type} available={available} />
      </Suspense>
    </div>
  );
}
