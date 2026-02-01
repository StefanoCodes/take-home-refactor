import { Skeleton } from '@/components/ui/skeleton';

export function CampaignGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`campaign-grid-skeleton-${i}`}
          className="rounded-lg border border-[--color-border] p-4"
        >
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <Skeleton className="mb-3 h-4 w-full" />
          <div className="mb-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-1 h-1.5 w-full rounded-full" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>
      ))}
    </div>
  );
}
