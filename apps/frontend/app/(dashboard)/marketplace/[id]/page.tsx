import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getAdSlot } from '@/lib/data-access/ad-slots/get-ad-slot';
import { getUserRole } from '@/lib/data-access/auth/get-user-role';
import {
  AdSlotDetailRoot,
  AdSlotDetailCard,
  AdSlotDetailHeader,
  AdSlotDetailTypeBadge,
  AdSlotDetailFooter,
  AdSlotDetailSection,
} from '@/components/dashboard/marketplace/marketplace-listing/ad-slot-detail';
import { BookAdSlotForm } from '@/components/dashboard/marketplace/marketplace-listing/book-ad-slot-form';
import { UnbookAdSlotButton } from '@/components/dashboard/marketplace/marketplace-listing/unbook-ad-slot-button';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdSlotPage({ params }: Props) {
  const { isLoggedIn, user } = await isAuthenticated();

  if (!isLoggedIn || !user) {
    return redirect('/login');
  }

  const { id } = await params;

  const [adSlot, roleInfo] = await Promise.all([getAdSlot(id), getUserRole(user.id)]);

  if (!adSlot) {
    return (
      <div className="space-y-4">
        <Link href="/marketplace" className="text-[--color-primary] hover:underline">
          ← Back to Marketplace
        </Link>
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
          Ad slot not found
        </div>
      </div>
    );
  }

  const isAvailable = adSlot.isAvailable;
  const isBooked = !isAvailable;
  const isSponsor = roleInfo.role === 'sponsor';
  const hasPublisher = !!adSlot.publisher;
  const hasPublisherWebsite = !!adSlot.publisher?.website;
  const hasDescription = !!adSlot.description;

  return (
    <AdSlotDetailRoot className="flex flex-col gap-4">
      <Link href="/marketplace" className="text-[--color-primary] hover:underline">
        ← Back to Marketplace
      </Link>

      <AdSlotDetailCard>
        <AdSlotDetailHeader>
          <div>
            <h1 className="text-2xl font-bold">{adSlot.name}</h1>
            {hasPublisher && (
              <p className="text-[--color-muted]">
                by {adSlot.publisher.name}
                {hasPublisherWebsite && (
                  <>
                    {' · '}
                    <a
                      href={adSlot.publisher.website ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[--color-primary] hover:underline"
                    >
                      {adSlot.publisher.website}
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
          <AdSlotDetailTypeBadge type={adSlot.type} />
        </AdSlotDetailHeader>

        {hasDescription && <p className="mb-6 text-[--color-muted]">{adSlot.description}</p>}

        <AdSlotDetailFooter>
          <div>
            <span
              className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-[--color-muted]'}`}
            >
              {isAvailable ? '● Available' : '○ Currently Booked'}
            </span>
            {isBooked && (
              <UnbookAdSlotButton
                adSlotId={adSlot.id}
                className="ml-3 text-sm text-[--color-primary] underline hover:opacity-80"
              />
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[--color-primary]">
              ${adSlot.basePrice.toLocaleString()}
            </p>
            <p className="text-sm text-[--color-muted]">per month</p>
          </div>
        </AdSlotDetailFooter>

        {isAvailable && (
          <AdSlotDetailSection>
            <h2 className="mb-4 text-lg font-semibold">Request This Placement</h2>

            {isSponsor && (
              <BookAdSlotForm
                adSlotId={adSlot.id}
                sponsorId={roleInfo.sponsorId}
                sponsorName={roleInfo.name ?? user.name}
              />
            )}

            {!isSponsor && (
              <div>
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-3 font-semibold text-gray-500"
                >
                  Request This Placement
                </button>
                <p className="mt-2 text-center text-sm text-[--color-muted]">
                  Only sponsors can request placements
                </p>
              </div>
            )}
          </AdSlotDetailSection>
        )}
      </AdSlotDetailCard>
    </AdSlotDetailRoot>
  );
}
