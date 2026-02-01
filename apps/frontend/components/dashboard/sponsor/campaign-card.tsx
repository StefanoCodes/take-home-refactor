import type { ReactNode } from 'react';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export function CampaignCard({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-[--color-border] p-4">{children}</div>;
}

export function CampaignCardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2 flex items-start justify-between">{children}</div>;
}

export function CampaignCardName({ name }: { name: string }) {
  return <h3 className="font-semibold">{name}</h3>;
}

export function CampaignCardStatus({ status }: { status: string }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${statusColors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}

export function CampaignCardDescription({ description }: { description: string | null }) {
  if (!description) return null;
  return <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{description}</p>;
}

export function CampaignCardBudget({ spent, budget }: { spent: number; budget: number }) {
  const progress = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm">
        <span className="text-[--color-muted]">Budget</span>
        <span>
          ${spent.toLocaleString()} / ${budget.toLocaleString()}
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-[--color-primary]"
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
    <div className="text-xs text-[--color-muted]">
      {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
    </div>
  );
}
