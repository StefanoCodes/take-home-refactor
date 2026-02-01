import { getCampaigns } from '@/lib/data-access-layer/campaigns/get-campaigns';
import { CampaignCardWithActions } from './campaign-card-with-actions';

export async function CampaignGrid({ sponsorId }: { sponsorId: string }) {
  const campaigns = await getCampaigns(sponsorId);

  const hasCampaigns = campaigns && campaigns.length > 0;

  if (!hasCampaigns) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-text-muted">
        No campaigns yet. Create your first campaign to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCardWithActions key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
