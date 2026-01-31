import { isAuthenticated } from '@/lib/auth-helpers.server';
import { AdSlotGrid } from '../../../components/dashboard/marketplace/ad-slot-grid';
import { redirect } from 'next/navigation';

// FIXME: This page fetches all ad slots client-side. Consider:
// 1. Server-side pagination with searchParams
// 2. Filtering by category, price range, slot type
// 3. Search functionality

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
        {/* TODO: Add search input and filter controls */}
      </div>

      <AdSlotGrid />
    </div>
  );
}
