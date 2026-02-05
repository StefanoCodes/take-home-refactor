import { queryOptions } from '@tanstack/react-query';
import type { AdSlotType, ListAdSlotsOutput } from '@anvara/schemas';
import { $fetch } from '@/lib/api-client';
import { dataAccessKeys, type AdSlotsParams } from '@/lib/react-query/keys';

export function createAdSlotsQueryOptions(params: AdSlotsParams = {}) {
  return queryOptions({
    queryKey: dataAccessKeys.adSlotsList(params),
    queryFn: async ({ signal }): Promise<ListAdSlotsOutput> => {
      const { data, error } = await $fetch('@get/api/ad-slots', {
        query: {
          ...(params.page && { page: params.page }),
          ...(params.limit && { limit: params.limit }),
          ...(params.type && { type: params.type as AdSlotType }),
          ...(params.available && { available: params.available }),
        },
        signal,
      });

      if (error) {
        throw new Error(error.statusText || 'Failed to fetch ad slots.');
      }

      return data;
    },
  });
}
