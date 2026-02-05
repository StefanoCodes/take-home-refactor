/**
 * Query key factory for data-access layer
 * Provides hierarchical query keys for React Query cache management
 */

export interface AdSlotsParams {
  page?: number;
  limit?: number;
  type?: string;
  available?: string;
}

export const dataAccessKeys = {
  root: () => ['data-access'] as const,

  // Ad Slots
  adSlots: () => [...dataAccessKeys.root(), 'ad-slots'] as const,
  adSlotsList: (params?: AdSlotsParams) => [...dataAccessKeys.adSlots(), 'list', params] as const,
};
