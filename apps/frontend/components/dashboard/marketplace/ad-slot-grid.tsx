import Link from 'next/link';
import { getAdSlots } from '@/lib/data-access/ad-slots/get-ad-slots';
import {
  AdSlotCardRoot,
  AdSlotCardHeader,
  AdSlotCardTypeBadge,
  AdSlotCardFooter,
} from './ad-slot-card';

export async function AdSlotGrid() {
  const adSlots = await getAdSlots();

  const hasAdSlots = adSlots.length > 0;

  if (!hasAdSlots) {
    return (
      <div className="rounded-lg border border-dashed border-[--color-border] p-12 text-center text-[--color-muted]">
        No ad slots available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <Link key={slot.id} href={`/marketplace/${slot.id}`}>
          <AdSlotCardRoot>
            <AdSlotCardHeader>
              <h3 className="font-semibold">{slot.name}</h3>
              <AdSlotCardTypeBadge type={slot.type} />
            </AdSlotCardHeader>

            {slot.publisher && (
              <p className="mb-2 text-sm text-[--color-muted]">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{slot.description}</p>
            )}

            <AdSlotCardFooter>
              <span
                className={`text-sm ${slot.isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
              >
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className="font-semibold text-[--color-primary]">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </AdSlotCardFooter>
          </AdSlotCardRoot>
        </Link>
      ))}
    </div>
  );
}
