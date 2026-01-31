import type React from 'react';
import { cn } from '@/lib/utils';

interface AdSlotCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardRoot({ children, className, ...props }: AdSlotCardRootProps) {
  return (
    <div
      className={cn(
        'block rounded-lg border border-[--color-border] p-4 transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AdSlotCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardHeader({ children, className, ...props }: AdSlotCardHeaderProps) {
  return (
    <div className={cn('mb-2 flex items-start justify-between', className)} {...props}>
      {children}
    </div>
  );
}

const typeColors: Record<string, string> = {
  DISPLAY: 'bg-blue-100 text-blue-700',
  VIDEO: 'bg-red-100 text-red-700',
  NEWSLETTER: 'bg-purple-100 text-purple-700',
  PODCAST: 'bg-orange-100 text-orange-700',
};

interface AdSlotCardTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
}

export function AdSlotCardTypeBadge({ type, className, ...props }: AdSlotCardTypeBadgeProps) {
  return (
    <span
      className={cn('rounded px-2 py-0.5 text-xs', typeColors[type] || 'bg-gray-100', className)}
      {...props}
    >
      {type}
    </span>
  );
}

interface AdSlotCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardFooter({ children, className, ...props }: AdSlotCardFooterProps) {
  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
