import type { ReactNode } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { campaignStatusColors } from '@/lib/utils';

export function CampaignCardRoot({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className} {...props}>
      {children}
    </Card>
  );
}

export function CampaignCardHeader({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <CardHeader className={className ?? 'mb-2'} {...props}>
      {children}
    </CardHeader>
  );
}

export function CampaignCardTitle({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={className ?? 'font-semibold'} {...props}>
      {children}
    </h3>
  );
}

export function CampaignCardStatusBadge({
  status,
  className,
  ...props
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-medium ${campaignStatusColors[status] ?? 'bg-white/10'} ${className ?? ''}`}
      {...props}
    >
      {status}
    </span>
  );
}

export function CampaignCardDescription({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={className ?? 'mb-3 text-sm text-text-muted line-clamp-2'} {...props}>
      {children}
    </p>
  );
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
