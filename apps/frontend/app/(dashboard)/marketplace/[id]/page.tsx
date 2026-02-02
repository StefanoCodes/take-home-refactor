import { isAuthenticated } from '@/lib/auth-helpers.server';
import { getAdSlot } from '@/lib/data-access-layer/ad-slots/get-ad-slot';
import { getUserRole } from '@/lib/data-access-layer/auth/get-user-role';
import { getUserQuoteForSlot } from '@/lib/data-access-layer/quotes/get-user-quote-for-slot';
import {
  AdSlotDetailRoot,
  AdSlotDetailCard,
  AdSlotDetailHeader,
  AdSlotDetailTypeBadge,
  AdSlotDetailFooter,
  AdSlotDetailSection,
} from '@/components/dashboard/marketplace/marketplace-listing/ad-slot-detail';
import { BookAdSlotForm } from '@/components/dashboard/marketplace/marketplace-listing/book-ad-slot-form';
import { RequestQuoteButton } from '@/components/dashboard/marketplace/marketplace-listing/request-quote-form';
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

  const [adSlot, roleInfo, existingQuote] = await Promise.all([
    getAdSlot(id),
    getUserRole(user.id),
    getUserQuoteForSlot(id),
  ]);

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
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Marketplace
      </Link>

      <AdSlotDetailCard>
        <AdSlotDetailHeader>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{adSlot.name}</h1>
            {hasPublisher && (
              <p className="mt-1 text-muted-foreground">
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
          <p className="mb-6 leading-relaxed text-muted-foreground">{adSlot.description}</p>
        )}

        <AdSlotDetailFooter>
          <div>
            <span
              className={`flex items-center gap-2 text-sm font-medium ${isAvailable ? 'text-emerald-500 dark:text-emerald-400/90' : 'text-muted-foreground'}`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${isAvailable ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-muted-foreground/30'}`}
              />
              {isAvailable ? 'Available' : 'Currently Booked'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight text-foreground">
              ${adSlot.basePrice.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
        </AdSlotDetailFooter>

        {isBooked && isPublisherOwner && (
          <AdSlotDetailSection>
            <UnbookAdSlotButton adSlotId={adSlot.id} />
          </AdSlotDetailSection>
        )}

        {isAvailable && (
          <AdSlotDetailSection>
            <h2 className="mb-5 text-lg font-semibold tracking-tight text-foreground">
              Request This Placement
            </h2>

            {isSponsor && (
              <div className="space-y-3">
                <BookAdSlotForm
                  adSlotId={adSlot.id}
                  sponsorId={roleInfo.sponsorId}
                  sponsorName={roleInfo.name ?? user.name}
                />
                <RequestQuoteButton
                  adSlotId={adSlot.id}
                  userEmail={user.email}
                  existingQuote={existingQuote}
                />
              </div>
            )}

            {!isSponsor && (
              <RequestQuoteButton
                adSlotId={adSlot.id}
                userEmail={user.email}
                existingQuote={existingQuote}
              />
            )}
          </AdSlotDetailSection>
        )}
      </AdSlotDetailCard>
    </AdSlotDetailRoot>
  );
}
