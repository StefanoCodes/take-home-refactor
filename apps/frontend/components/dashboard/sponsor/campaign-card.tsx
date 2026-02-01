import type { ReactNode } from 'react';
import { Card, CardHeader } from '@/components/ui/card';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-white/10 text-text-muted',
  ACTIVE: 'bg-green-500/15 text-green-400',
  PAUSED: 'bg-yellow-500/15 text-yellow-400',
  COMPLETED: 'bg-blue-500/15 text-blue-400',
};

export function CampaignCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}

export function CampaignCardHeader({ children }: { children: ReactNode }) {
  return <CardHeader className="mb-2">{children}</CardHeader>;
}

export function CampaignCardName({ name }: { name: string }) {
  return <h3 className="font-semibold">{name}</h3>;
}

export function CampaignCardStatus({ status }: { status: string }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusColors[status] || 'bg-white/10'}`}>
      {status}
    </span>
  );
}

export function CampaignCardDescription({ description }: { description: string | null }) {
  if (!description) return null;
  return <p className="mb-3 text-sm text-text-muted line-clamp-2">{description}</p>;
}

export function CampaignCardBudget({ spent, budget }: { spent: number; budget: number }) {
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-muted">Budget</span>
        <span>
          ${spent.toLocaleString()} / ${budget.toLocaleString()}
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-brand-primary"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function CampaignCardDateRange({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  return (
    <div className="text-xs text-text-muted">
      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
    </div>
  );
}
