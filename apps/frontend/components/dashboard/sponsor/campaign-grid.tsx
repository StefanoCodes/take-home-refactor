import { getCampaigns } from '@/lib/data-access/campaigns/get-campaigns';
import { CampaignCard } from './campaign-card';

export async function CampaignGrid({ sponsorId }: { sponsorId: string }) {
  const campaigns = await getCampaigns(sponsorId);

  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[--color-border] p-8 text-center text-[--color-muted]">
        No campaigns yet. Create your first campaign to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
