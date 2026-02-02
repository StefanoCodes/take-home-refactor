import type { AdSlotType } from '@anvara/schemas';
import type React from 'react';
import { adSlotTypeColors, cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface AdSlotDetailRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotDetailRoot({ children, className, ...props }: AdSlotDetailRootProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {children}
    </div>
  );
}

interface AdSlotDetailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotDetailCard({ children, className, ...props }: AdSlotDetailCardProps) {
  return (
    <Card className={cn('p-8', className)} {...props}>
      {children}
    </Card>
  );
}

interface AdSlotDetailHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotDetailHeader({ children, className, ...props }: AdSlotDetailHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between', className)} {...props}>
      {children}
    </div>
  );
}

interface AdSlotDetailTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotDetailTypeBadge({ type, className, ...props }: AdSlotDetailTypeBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-3.5 py-1 text-xs font-medium tracking-wide uppercase',
        adSlotTypeColors[type] ?? 'bg-muted text-text-muted',
        className
      )}
      {...props}
    >
      {type}
    </span>
  );
}

interface AdSlotDetailFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotDetailFooter({ children, className, ...props }: AdSlotDetailFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-border pt-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AdSlotDetailSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotDetailSection({ children, className, ...props }: AdSlotDetailSectionProps) {
  return (
    <div className={cn('mt-8 border-t border-border pt-8', className)} {...props}>
      {children}
    </div>
  );
}
