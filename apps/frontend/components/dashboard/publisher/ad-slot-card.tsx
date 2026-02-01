import type { AdSlotListItem } from '@anvara/schemas';
import {
  AdSlotCardRoot,
  AdSlotCardHeader,
  AdSlotCardTypeBadge,
  AdSlotCardFooter,
} from '@/components/dashboard/marketplace/ad-slot-card';

type AdSlotCardProps = Pick<AdSlotListItem, 'name' | 'type' | 'description' | 'isAvailable' | 'basePrice'>;

export function AdSlotCard({
  name,
  type,
  description,
  isAvailable,
  basePrice,
}: AdSlotCardProps) {
  return (
    <AdSlotCardRoot>
      <AdSlotCardHeader>
        <h3 className="font-semibold">{name}</h3>
        <AdSlotCardTypeBadge type={type} />
      </AdSlotCardHeader>

      {description && (
        <p className="mb-3 text-sm text-[--color-muted] line-clamp-2">{description}</p>
      )}

      <AdSlotCardFooter>
        <span className={`text-sm ${isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}>
          {isAvailable ? 'Available' : 'Booked'}
        </span>
        <span className="font-semibold text-[--color-primary]">
          ${Number(basePrice).toLocaleString()}/mo
        </span>
      </AdSlotCardFooter>
    </AdSlotCardRoot>
  );
}
