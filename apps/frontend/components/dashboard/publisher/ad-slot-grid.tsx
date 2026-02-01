import { getPublisherAdSlots } from '@/lib/data-access-layer/ad-slots/get-publisher-ad-slots';
import { AdSlotCard } from './ad-slot-card';

export async function AdSlotGrid({ publisherId }: { publisherId: string }) {
  const adSlots = await getPublisherAdSlots(publisherId);

  const hasAdSlots = adSlots.length > 0;

  if (!hasAdSlots) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center text-text-muted">
        No ad slots yet. Create your first ad slot to start earning.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {adSlots.map((slot) => (
        <AdSlotCard
          key={slot.id}
          name={slot.name}
          type={slot.type}
          description={slot.description}
          isAvailable={slot.isAvailable}
          basePrice={slot.basePrice}
        />
      ))}
    </div>
  );
}
