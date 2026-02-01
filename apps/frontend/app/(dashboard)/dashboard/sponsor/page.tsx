import { Suspense } from 'react';
import { CreateCampaignButton } from '@/components/dashboard/sponsor/actions/create-campaign-button';
import { CampaignGrid } from '@/components/dashboard/sponsor/campaign-grid';
import { CampaignGridSkeleton } from '@/components/dashboard/sponsor/campaign-grid-skeleton';
import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
import { redirect } from 'next/navigation';

export default async function SponsorDashboard() {
  const { user } = await isAuthenticated();

  if (!user) {
    return redirect('/login');
  }

  const roleData = await getUserRole(user.id);

  if (roleData.role !== 'sponsor') {
    return redirect('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Campaigns</h1>
        <CreateCampaignButton sponsorId={roleData.sponsorId} />
      </div>

      <Suspense fallback={<CampaignGridSkeleton />}>
        <CampaignGrid sponsorId={roleData.sponsorId} />
      </Suspense>
    </div>
  );
}
