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
        'group/card transition-all duration-200 ease-out hover:border-white/[0.12] hover:bg-gradient-to-b hover:from-white/[0.08] hover:to-white/[0.03] hover:-translate-y-0.5',
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
  DISPLAY: 'bg-blue-400/10 text-blue-300 ring-1 ring-blue-400/20',
  VIDEO: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20',
  NATIVE: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20',
  NEWSLETTER: 'bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20',
  PODCAST: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20',
};

interface AdSlotCardTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotCardTypeBadge({ type, className, ...props }: AdSlotCardTypeBadgeProps) {
  return (
    <span
      className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase', typeColors[type] || 'bg-white/10 text-text-muted', className)}
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
