import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function AdSlotGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={`ad-slot-grid-skeleton-${i}`}>
          <div className="mb-2 flex items-start justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-1 h-4 w-3/4" />
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
}
