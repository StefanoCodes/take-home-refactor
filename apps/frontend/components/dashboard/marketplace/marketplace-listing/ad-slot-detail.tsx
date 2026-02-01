import type { AdSlotType } from '@anvara/schemas';
import type React from 'react';
import { cn } from '@/lib/utils';
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
    <Card className={cn('p-6', className)} {...props}>
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

const typeColors: Record<AdSlotType, string> = {
  DISPLAY: 'bg-blue-500/15 text-blue-400',
  VIDEO: 'bg-red-500/15 text-red-400',
  NATIVE: 'bg-green-500/15 text-green-400',
  NEWSLETTER: 'bg-purple-500/15 text-purple-400',
  PODCAST: 'bg-orange-500/15 text-orange-400',
};

interface AdSlotDetailTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotDetailTypeBadge({ type, className, ...props }: AdSlotDetailTypeBadgeProps) {
  return (
    <span
      className={cn('rounded-md px-3 py-1 text-sm font-medium', typeColors[type] || 'bg-white/10 text-text-muted', className)}
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
      className={cn('flex items-center justify-between border-t border-white/[0.08] pt-4', className)}
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
    <div
      className={cn('mt-6 border-t border-white/[0.08] pt-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
