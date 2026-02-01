import { getCampaigns } from '@/lib/data-access-layer/campaigns/get-campaigns';
import {
  CampaignCard,
  CampaignCardHeader,
  CampaignCardName,
  CampaignCardStatus,
  CampaignCardDescription,
  CampaignCardBudget,
  CampaignCardDateRange,
} from './campaign-card';

export async function CampaignGrid({ sponsorId }: { sponsorId: string }) {
  const campaigns = await getCampaigns(sponsorId);

  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-text-muted">
        No campaigns yet. Create your first campaign to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id}>
          <CampaignCardHeader>
            <CampaignCardName name={campaign.name} />
            <CampaignCardStatus status={campaign.status} />
          </CampaignCardHeader>
          <CampaignCardDescription description={campaign.description} />
          <CampaignCardBudget spent={Number(campaign.spent)} budget={Number(campaign.budget)} />
          <CampaignCardDateRange startDate={campaign.startDate} endDate={campaign.endDate} />
        </CampaignCard>
      ))}
    </div>
  );
}
