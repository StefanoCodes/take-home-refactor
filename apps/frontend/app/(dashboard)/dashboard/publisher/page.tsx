import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/data-access/auth/get-user-role';
import { AdSlotList } from '../../../../components/dashboard/publisher/ad-slot-list';
import { isAuthenticated } from '@/lib/auth-helpers.server';

export default async function PublisherDashboard() {
  const { user } = await isAuthenticated();

  if (!user) {
    return redirect('/login');
  }

  // Verify user has 'publisher' role
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

      <AdSlotList />
    </div>
  );
}
