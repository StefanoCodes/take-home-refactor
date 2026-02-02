import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date string for use in `<input type="date">` (YYYY-MM-DD).
 */
export function formatDateForInput(dateStr: string): string {
	if (!dateStr) return "";
	try {
		return new Date(dateStr).toISOString().slice(0, 10);
	} catch {
		return dateStr.slice(0, 10);
	}
}

/** Tailwind class map for campaign status badges. */
export const campaignStatusColors: Record<string, string> = {
	DRAFT: "bg-muted text-muted-foreground",
	PENDING_REVIEW: "bg-muted text-muted-foreground",
	APPROVED: "bg-muted text-muted-foreground",
	ACTIVE: "bg-green-500/15 text-green-600 dark:text-green-400",
	PAUSED: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
	COMPLETED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
	CANCELLED: "bg-muted text-muted-foreground",
};

/** Tailwind class map for ad slot type badges. */
export const adSlotTypeColors: Record<string, string> = {
	DISPLAY: "bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/25 dark:text-blue-300 dark:ring-blue-400/20",
	VIDEO: "bg-rose-500/15 text-rose-600 ring-1 ring-rose-500/25 dark:text-rose-300 dark:ring-rose-400/20",
	NATIVE: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-300 dark:ring-emerald-400/20",
	NEWSLETTER: "bg-violet-500/15 text-violet-600 ring-1 ring-violet-500/25 dark:text-violet-300 dark:ring-violet-400/20",
	PODCAST: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/25 dark:text-amber-300 dark:ring-amber-400/20",
};
