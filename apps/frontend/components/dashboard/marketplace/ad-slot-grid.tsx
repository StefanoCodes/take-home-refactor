'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { createAdSlotsQueryOptions } from '@/lib/react-query/queries/ad-slots';
import {
  AdSlotCardRoot,
  AdSlotCardHeader,
  AdSlotCardTypeBadge,
  AdSlotCardFooter,
} from './ad-slot-card';
import { MarketplaceFilters, MarketplacePagination } from './marketplace-controls';
import { AdSlotGridSkeleton } from './ad-slot-grid-skeleton';
import { Button } from '@/components/ui/button';

const DEFAULT_LIMIT = 6;

export function AdSlotGrid() {
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const typeParam = searchParams.get('type');
  const availableParam = searchParams.get('available');

  const page = Math.max(1, Number(pageParam) || 1);
  const limit = Number(limitParam) || DEFAULT_LIMIT;
  const type = typeParam && typeParam !== 'all' ? typeParam : undefined;
  const available = availableParam && availableParam !== 'all' ? availableParam : undefined;

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(type && { type }),
      ...(available && { available }),
    }),
    [page, limit, type, available]
  );

  const { data, isLoading, isError, error, refetch } = useQuery(
    createAdSlotsQueryOptions(queryParams)
  );

  if (isLoading) {
    return <AdSlotGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          {error?.message || 'Failed to load ad slots. Please try again.'}
        </p>
        <Button className="mt-4" onClick={() => refetch()} variant="secondary">
          Retry
        </Button>
      </div>
    );
  }

  const adSlots = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page,
    limit,
    total: 0,
    totalPages: 0,
    hasMore: false,
  };

  const hasAdSlots = adSlots.length > 0;
  const hasActiveFilters = !!type || !!available;

  return (
    <div className="space-y-5">
      <MarketplaceFilters type={type} available={available} />

      {!hasAdSlots ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-16 text-center text-muted-foreground">
          {hasActiveFilters
            ? 'No ad slots match the selected filters.'
            : 'No ad slots available at the moment.'}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adSlots.map((slot) => (
            <Link key={slot.id} href={`/marketplace/${slot.id}`}>
              <AdSlotCardRoot>
                <AdSlotCardHeader>
                  <h3 className="font-semibold tracking-tight text-foreground">{slot.name}</h3>
                  <AdSlotCardTypeBadge type={slot.type} />
                </AdSlotCardHeader>

                {slot.publisher && (
                  <p className="mb-2 text-sm text-muted-foreground">by {slot.publisher.name}</p>
                )}

                {slot.description && (
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {slot.description}
                  </p>
                )}

                <AdSlotCardFooter className="mt-auto border-t border-border pt-4">
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium ${slot.isAvailable ? 'text-emerald-500 dark:text-emerald-400/90' : 'text-muted-foreground'}`}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${slot.isAvailable ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-muted-foreground/30'}`}
                    />
                    {slot.isAvailable ? 'Available' : 'Booked'}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    ${Number(slot.basePrice).toLocaleString()}
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </span>
                </AdSlotCardFooter>
              </AdSlotCardRoot>
            </Link>
          ))}
        </div>
      )}

      <MarketplacePagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasMore={pagination.hasMore}
        limit={pagination.limit}
      />
    </div>
  );
}
