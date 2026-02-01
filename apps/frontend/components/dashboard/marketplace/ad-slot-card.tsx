import type { AdSlotType } from '@anvara/schemas';
import type React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';

interface AdSlotCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardRoot({ children, className, ...props }: AdSlotCardRootProps) {
  return (
    <Card
      className={cn(
        'transition-all hover:border-white/[0.15] hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

interface AdSlotCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardHeader({ children, className, ...props }: AdSlotCardHeaderProps) {
  return (
    <CardHeader className={cn('mb-2', className)} {...props}>
      {children}
    </CardHeader>
  );
}

const typeColors: Record<AdSlotType, string> = {
  DISPLAY: 'bg-blue-500/15 text-blue-400',
  VIDEO: 'bg-red-500/15 text-red-400',
  NATIVE: 'bg-green-500/15 text-green-400',
  NEWSLETTER: 'bg-purple-500/15 text-purple-400',
  PODCAST: 'bg-orange-500/15 text-orange-400',
};

interface AdSlotCardTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotCardTypeBadge({ type, className, ...props }: AdSlotCardTypeBadgeProps) {
  return (
    <span
      className={cn('rounded-md px-2 py-0.5 text-xs font-medium', typeColors[type] || 'bg-white/10 text-text-muted', className)}
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
    <CardFooter className={className} {...props}>
      {children}
    </CardFooter>
  );
}
