import Link from 'next/link';
import { getAdSlots } from '@/lib/data-access-layer/ad-slots/get-ad-slots';
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
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-16 text-center text-white/40">
        No ad slots available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <Link key={slot.id} href={`/marketplace/${slot.id}`}>
          <AdSlotCardRoot>
            <AdSlotCardHeader>
              <h3 className="font-semibold tracking-tight text-white/90">{slot.name}</h3>
              <AdSlotCardTypeBadge type={slot.type} />
            </AdSlotCardHeader>

            {slot.publisher && (
              <p className="mb-2 text-sm text-white/40">by {slot.publisher.name}</p>
            )}

            {slot.description && (
              <p className="mb-4 text-sm leading-relaxed text-white/35 line-clamp-2">
                {slot.description}
              </p>
            )}

            <AdSlotCardFooter className="mt-auto border-t border-white/[0.06] pt-4">
              <span
                className={`flex items-center gap-1.5 text-sm font-medium ${slot.isAvailable ? 'text-emerald-400/90' : 'text-white/30'}`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${slot.isAvailable ? 'bg-emerald-400' : 'bg-white/20'}`}
                />
                {slot.isAvailable ? 'Available' : 'Booked'}
              </span>
              <span className="text-lg font-semibold tracking-tight text-white/80">
                ${Number(slot.basePrice).toLocaleString()}
                <span className="text-xs font-normal text-white/35">/mo</span>
              </span>
            </AdSlotCardFooter>
          </AdSlotCardRoot>
        </Link>
      ))}
    </div>
  );
}
