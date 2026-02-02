import type { AdSlotType } from '@anvara/schemas';
import type React from 'react';
import { adSlotTypeColors, cn } from '@/lib/utils';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';

interface AdSlotCardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdSlotCardRoot({ children, className, ...props }: AdSlotCardRootProps) {
  return (
    <Card
      className={cn(
        'group/card transition-all duration-200 ease-out hover:border-border hover:bg-gradient-to-b hover:from-foreground/[0.05] hover:to-foreground/[0.01] hover:-translate-y-0.5',
        className
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

interface AdSlotCardTypeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: AdSlotType;
}

export function AdSlotCardTypeBadge({ type, className, ...props }: AdSlotCardTypeBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase',
        adSlotTypeColors[type] ?? 'bg-muted text-text-muted',
        className
      )}
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
