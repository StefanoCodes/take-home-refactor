import { Suspense } from 'react';
import { AdSlotGrid } from '@/components/dashboard/publisher/ad-slot-grid';
import { AdSlotGridSkeleton } from '@/components/dashboard/publisher/ad-slot-grid-skeleton';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
import { redirect } from 'next/navigation';

export default async function PublisherDashboard() {
  const { user } = await isAuthenticated();

  if (!user) {
    return redirect('/login');
  }

  const roleData = await getUserRole(user.id);

  if (roleData.role !== 'publisher') {
    return redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Ad Slots</h1>
        {/* TODO: Add CreateAdSlotButton here */}
      </div>

      <Suspense fallback={<AdSlotGridSkeleton />}>
        <AdSlotGrid publisherId={roleData.publisherId} />
      </Suspense>
    </div>
  );
}
