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
	DRAFT: "bg-white/10 text-text-muted",
	PENDING_REVIEW: "bg-white/10 text-text-muted",
	APPROVED: "bg-white/10 text-text-muted",
	ACTIVE: "bg-green-500/15 text-green-400",
	PAUSED: "bg-yellow-500/15 text-yellow-400",
	COMPLETED: "bg-blue-500/15 text-blue-400",
	CANCELLED: "bg-white/10 text-text-muted",
};

/** Tailwind class map for ad slot type badges. */
export const adSlotTypeColors: Record<string, string> = {
	DISPLAY: "bg-blue-400/10 text-blue-300 ring-1 ring-blue-400/20",
	VIDEO: "bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20",
	NATIVE: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20",
	NEWSLETTER: "bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20",
	PODCAST: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20",
};
