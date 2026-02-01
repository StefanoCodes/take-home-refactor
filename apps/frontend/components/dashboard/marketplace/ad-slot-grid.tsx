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
      <div className="rounded-xl border border-dashed border-white/[0.08] p-12 text-center text-text-muted">
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
              <p className="mb-2 text-sm text-text-muted">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-3 text-sm text-text-muted line-clamp-2">{slot.description}</p>
            )}

            <AdSlotCardFooter>
              <span
                className={`text-sm ${slot.isAvailable ? 'text-green-400' : 'text-text-muted'}`}
              >
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className="font-semibold text-brand-primary">
                ${Number(slot.basePrice).toLocaleString()}/mo
              </span>
            </AdSlotCardFooter>
          </AdSlotCardRoot>
        </Link>
      ))}
    </div>
  );
}
