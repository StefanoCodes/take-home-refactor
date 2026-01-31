import { Loader2Icon } from 'lucide-react';

export function GlobalLoading() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-4 duration-500 h-svh max-w-7xl mx-auto">
      <Loader2Icon className="size-4 animate-spin" />
    </div>
  );
}
