"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PAGINATION_JUMP_AHEAD = 7;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  // Optional props for limit selection
  limit?: number;
  onLimitChange?: (limit: number) => void;
  limitLabel?: string;
  limitOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  isLoading = false,
  limit,
  onLimitChange,
  limitLabel = "Items per page:",
  limitOptions = [5, 10, 20, 50, 100],
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getJumpAheadPage = () => {
    const jumpTarget = currentPage + PAGINATION_JUMP_AHEAD;
    return Math.min(jumpTarget, totalPages);
  };

  const shouldShowJumpAhead = () => {
    const jumpTarget = getJumpAheadPage();
    return (
      jumpTarget > currentPage && jumpTarget > Math.max(...getVisiblePages())
    );
  };

  const getVisiblePages = () => {
    const maxVisiblePages = 3;
    const pages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const hasLimitSelector = limit !== undefined && onLimitChange !== undefined;
  const showPaginationControls = totalPages > 1;

  // Don't render if there's only one page and no limit selector
  if (totalPages <= 1 && !hasLimitSelector) {
    return null;
  }

  const paginationControls = (
    <div className="flex items-center gap-2">
      <button
        className="flex h-6 w-6 cursor-pointer items-center justify-center gap-1 text-[#6b7385] disabled:opacity-50 dark:text-white/70"
        disabled={currentPage === 1 || isLoading}
        onClick={handlePrevious}
        type="button"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page) => (
          <button
            className={cn(
              "h-[35px] w-[35px] cursor-pointer select-none rounded-[8px] border border-[#EEF3F1] transition-colors dark:border-white/10 dark:bg-[#0f0e19] dark:text-white/70",
              page === currentPage
                ? "border-[#4057FF]/30 bg-[#4057FF]/10 text-[#4057FF] shadow-[0px_0px_0px_1px_rgba(64,87,255,0.15),0px_1px_1px_-0.5px_rgba(42,51,70,0.03),0px_2px_2px_-1px_rgba(42,51,70,0.04),0px_3px_3px_-1.5px_rgba(42,51,70,0.04)] dark:border-[#4057FF]/20 dark:bg-[linear-gradient(162.92deg,rgba(64,87,255,0.15)_0%,rgba(64,87,255,0.05)_100%)] dark:text-[#7B93FF] dark:shadow-[0px_10px_19.9px_rgba(0,0,0,0.25)] dark:hover:bg-[#1d1c26]/80"
                : "hover:bg-[#F6F8FA] dark:hover:bg-[#1d1c26]/50"
            )}
            disabled={isLoading}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}

        {shouldShowJumpAhead() && (
          <span className="flex h-[35px] w-[35px] select-none items-center justify-center rounded-[8px] border border-[#EEF3F1] bg-white text-[#6b7385] dark:border-white/10 dark:bg-[#0f0e19] dark:text-white/50">
            ...
          </span>
        )}
      </div>

      {shouldShowJumpAhead() && (
        <button
          className={cn(
            "h-[35px] w-[35px] cursor-pointer select-none rounded-[8px] border border-[#EEF3F1] transition-colors hover:bg-[#F6F8FA] dark:border-white/10 dark:bg-[#0f0e19] dark:text-white/70 dark:hover:bg-[#1d1c26]/50"
          )}
          disabled={isLoading}
          onClick={() => onPageChange(getJumpAheadPage())}
          type="button"
        >
          {getJumpAheadPage()}
        </button>
      )}

      <button
        className="flex h-6 w-6 cursor-pointer items-center gap-1 text-[#6b7385] disabled:opacity-50 dark:text-white/70"
        disabled={!hasMore || currentPage >= totalPages || isLoading}
        onClick={handleNext}
        type="button"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );

  // If limit selector is provided, pagination left / limit right
  if (hasLimitSelector) {
    return (
      <div className="flex flex-row items-center justify-between gap-4 py-4">
        {/* Pagination controls - left */}
        <div>{showPaginationControls && paginationControls}</div>

        {/* Items per page selector - right */}
        <div className="flex items-center gap-2 text-sm text-[#6b7385] dark:text-white/70">
          <span>{limitLabel}</span>
          <Select
            disabled={isLoading}
            onValueChange={(value) => onLimitChange(Number.parseInt(value, 10))}
            value={limit.toString()}
          >
            <SelectTrigger className="h-8 w-[70px] cursor-pointer rounded-md border-0 bg-[linear-gradient(180deg,#4057FF_0%,#2446F4_100%)] text-white opacity-100 hover:opacity-80 dark:border dark:border-[rgba(64,87,255,0.12)] dark:bg-[linear-gradient(180deg,rgba(64,87,255,0.08)_8%,rgba(64,87,255,0)_100%)] dark:text-[#7B93FF]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border border-[#EEF3F1] bg-background text-foreground dark:border-white/10 dark:bg-[#1a1822] dark:text-white">
              {limitOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Default centered layout without limit selector
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {paginationControls}
    </div>
  );
}
