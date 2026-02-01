import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getAdSlot } from '@/lib/data-access-layer/ad-slots/get-ad-slot';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
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
  const isPublisherOwner = adSlot.publisher?.userId === user.id;
  const hasPublisher = !!adSlot.publisher;
  const hasPublisherWebsite = !!adSlot.publisher?.website;
  const hasDescription = !!adSlot.description;

  return (
    <AdSlotDetailRoot className="flex flex-col gap-4">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white/70"
      >
        ← Back to Marketplace
      </Link>

      <AdSlotDetailCard>
        <AdSlotDetailHeader>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white/90">{adSlot.name}</h1>
            {hasPublisher && (
              <p className="mt-1 text-white/40">
                by {adSlot.publisher.name}
                {hasPublisherWebsite && (
                  <>
                    {' · '}
                    <a
                      href={adSlot.publisher.website ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400/80 transition-colors hover:text-blue-300"
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

        {hasDescription && (
          <p className="mb-6 leading-relaxed text-white/35">{adSlot.description}</p>
        )}

        <AdSlotDetailFooter>
          <div>
            <span
              className={`flex items-center gap-2 text-sm font-medium ${isAvailable ? 'text-emerald-400/90' : 'text-white/30'}`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-white/20'}`}
              />
              {isAvailable ? 'Available' : 'Currently Booked'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight text-white/85">
              ${adSlot.basePrice.toLocaleString()}
            </p>
            <p className="text-sm text-white/35">per month</p>
          </div>
        </AdSlotDetailFooter>

        {isBooked && isPublisherOwner && (
          <AdSlotDetailSection>
            <UnbookAdSlotButton adSlotId={adSlot.id} />
          </AdSlotDetailSection>
        )}

        {isAvailable && (
          <AdSlotDetailSection>
            <h2 className="mb-5 text-lg font-semibold tracking-tight text-white/80">
              Request This Placement
            </h2>

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
                  className="w-full cursor-not-allowed rounded-xl bg-white/[0.05] px-4 py-3 font-semibold text-white/25 ring-1 ring-white/[0.06]"
                >
                  Request This Placement
                </button>
                <p className="mt-3 text-center text-sm text-white/30">
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
