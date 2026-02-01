import type { AdSlotType } from '@anvara/schemas';
import type React from 'react';
import { cn } from '@/lib/utils';

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
    <div
      className={cn('rounded-lg border border-[--color-border] p-6', className)}
      {...props}
    >
      {children}
    </div>
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
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NATIVE: 'bg-green-100 text-green-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface AdSlotDetailTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotDetailTypeBadge({ type, className, ...props }: AdSlotDetailTypeBadgeProps) {
  return (
    <span
      className={cn('rounded px-3 py-1 text-sm', typeColors[type] || 'bg-gray-100', className)}
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
      className={cn('flex items-center justify-between border-t border-[--color-border] pt-4', className)}
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
      className={cn('mt-6 border-t border-[--color-border] pt-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
