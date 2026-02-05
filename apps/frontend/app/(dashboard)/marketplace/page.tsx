import { isAuthenticated } from '@/lib/auth-helpers.server';
import { AdSlotGrid } from '@/components/dashboard/marketplace/ad-slot-grid';
import { redirect } from 'next/navigation';

export default async function MarketplacePage() {
  const { isLoggedIn } = await isAuthenticated();

  if (!isLoggedIn) {
    return redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketplace</h1>
        <p className="mt-1 text-muted-foreground">Browse available ad slots from our publishers</p>
      </div>
      <AdSlotGrid />
    </div>
  );
}
