import { Suspense } from 'react';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { AdSlotGrid } from '@/components/dashboard/marketplace/ad-slot-grid';
import { AdSlotGridSkeleton } from '@/components/dashboard/marketplace/ad-slot-grid-skeleton';
import { redirect } from 'next/navigation';

export default async function MarketplacePage() {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) {
    return redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <p className="text-[--color-muted]">Browse available ad slots from our publishers</p>
      </div>

      <Suspense fallback={<AdSlotGridSkeleton />}>
        <AdSlotGrid />
      </Suspense>
    </div>
  );
}
