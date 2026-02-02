import Link from 'next/link';
import { getAdSlots } from '@/lib/data-access-layer/ad-slots/get-ad-slots';
import {
  AdSlotCardRoot,
  AdSlotCardHeader,
  AdSlotCardTypeBadge,
  AdSlotCardFooter,
} from './ad-slot-card';
import { MarketplaceFilters, MarketplacePagination } from './marketplace-controls';

interface AdSlotGridProps {
  page?: number;
  limit?: number;
  type?: string;
  available?: string;
}

export async function AdSlotGrid({ page = 1, limit = 6, type, available }: AdSlotGridProps) {
  const result = await getAdSlots({ page, limit, type, available });
  const { data: adSlots, pagination } = result;

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
