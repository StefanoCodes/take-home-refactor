"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";

const AD_SLOT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "DISPLAY", label: "Display" },
  { value: "VIDEO", label: "Video" },
  { value: "NATIVE", label: "Native" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "PODCAST", label: "Podcast" },
] as const;

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All Slots" },
  { value: "true", label: "Available Only" },
] as const;

interface MarketplaceFiltersProps {
  type?: string;
  available?: string;
}

export function MarketplaceFilters({ type, available }: MarketplaceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={type || "all"}
        onValueChange={(value) => updateParams("type", value)}
      >
        <SelectTrigger className="w-[160px] border-border bg-muted text-foreground">
          <SelectValue placeholder="Slot Type" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover text-popover-foreground">
          {AD_SLOT_TYPES.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={available || "all"}
        onValueChange={(value) => updateParams("available", value)}
      >
        <SelectTrigger className="w-[170px] border-border bg-muted text-foreground">
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover text-popover-foreground">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const LIMIT_OPTIONS = [6, 12, 18, 24] as const;

interface MarketplacePaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  limit: number;
}

export function MarketplacePagination({
  currentPage,
  totalPages,
  hasMore,
  limit,
}: MarketplacePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page: page === 1 ? null : page.toString() });
    },
    [updateParams]
  );

  const handleLimitChange = useCallback(
    (newLimit: number) => {
      // Reset to page 1 when limit changes
      updateParams({
        limit: newLimit === 6 ? null : newLimit.toString(),
        page: null,
      });
    },
    [updateParams]
  );

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      hasMore={hasMore}
      onPageChange={handlePageChange}
      limit={limit}
      onLimitChange={handleLimitChange}
      limitOptions={[...LIMIT_OPTIONS]}
      limitLabel="Per page:"
    />
  );
}
