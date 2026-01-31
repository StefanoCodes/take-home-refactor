import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-4 duration-500 h-svh max-w-7xl mx-auto">
      <Skeleton className="w-full h-10 bg-background/10" />
      <Skeleton className="w-[80%] h-10 bg-background/10" />
      <Skeleton className="w-[60%] h-10 bg-background/10" />
    </div>
  );
}
