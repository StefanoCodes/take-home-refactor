import { createFetch, createSchema, ErrorContext } from '@better-fetch/fetch';
import { logger as betterFetchLogger } from '@better-fetch/logger';

// Common
import { errorResponseSchema } from '@anvara/schemas';

// Sponsors
import { listSponsorsOutputSchema } from '@anvara/schemas';
import { getSponsorOutputSchema } from '@anvara/schemas';
import { createSponsorInputSchema, createSponsorOutputSchema } from '@anvara/schemas';

// Publishers
import { listPublishersOutputSchema } from '@anvara/schemas';
import { getPublisherOutputSchema } from '@anvara/schemas';

// Campaigns
import { listCampaignsQuerySchema, listCampaignsOutputSchema } from '@anvara/schemas';
import { getCampaignOutputSchema } from '@anvara/schemas';
import { createCampaignInputSchema, createCampaignOutputSchema } from '@anvara/schemas';
import { updateCampaignInputSchema } from '@anvara/schemas';

// Ad Slots
import { listAdSlotsQuerySchema, listAdSlotsOutputSchema } from '@anvara/schemas';
import { getAdSlotOutputSchema } from '@anvara/schemas';
import { createAdSlotInputSchema, createAdSlotOutputSchema } from '@anvara/schemas';
import { updateAdSlotInputSchema } from '@anvara/schemas';
import { bookAdSlotInputSchema, bookAdSlotOutputSchema } from '@anvara/schemas';
import { unbookAdSlotOutputSchema } from '@anvara/schemas';

// Placements
import { listPlacementsQuerySchema, listPlacementsOutputSchema } from '@anvara/schemas';
import { createPlacementInputSchema, createPlacementOutputSchema } from '@anvara/schemas';

// Dashboard
import { getDashboardStatsOutputSchema } from '@anvara/schemas';

// Health
import { getHealthOutputSchema } from '@anvara/schemas';

// Newsletter
import { subscribeNewsletterInputSchema, subscribeNewsletterOutputSchema } from '@anvara/schemas';

// Quotes
import {
  requestQuoteInputSchema,
  requestQuoteOutputSchema,
  listUserQuotesOutputSchema,
  listPublisherQuotesOutputSchema,
  updateQuoteStatusInputSchema,
  updateQuoteStatusOutputSchema,
} from '@anvara/schemas';

// Auth
import { getMeOutputSchema } from '@anvara/schemas';
import { getUserRoleOutputSchema } from '@anvara/schemas';
import { Logger } from './logger';

export const $fetch = createFetch({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  disableValidation: process.env.NODE_ENV !== 'development',
  retry: {
    type: 'linear',
    attempts: 3,
    delay: 1000,
    shouldRetry: (response) => {
      // Only retry on server errors (5xx), rate limiting (429), or network failures (null)
      if (!response) return true;
      return response.status >= 500 || response.status === 429 || response.status === 408;
    },
  },
  onError: (context: ErrorContext) => {
    Logger.error(context.error.error, {
      status: context.error.status,
      statusText: context.error.statusText,
    });
  },
  defaultError: errorResponseSchema,
  schema: createSchema({
    // Health
    '@get/api/health': {
      output: getHealthOutputSchema,
    },

    // Auth
    '@get/api/auth/me': {
      output: getMeOutputSchema,
    },
    '@get/api/auth/role/:userId': {
      output: getUserRoleOutputSchema,
    },

    // Sponsors
    '@get/api/sponsors': {
      output: listSponsorsOutputSchema,
    },

    '@get/api/sponsors/:id': {
      output: getSponsorOutputSchema,
    },
    '@post/api/sponsors': {
      input: createSponsorInputSchema,
      output: createSponsorOutputSchema,
    },

    // Publishers
    '@get/api/publishers': {
      output: listPublishersOutputSchema,
    },
    '@get/api/publishers/:id': {
      output: getPublisherOutputSchema,
    },

    // Campaigns
    '@get/api/campaigns': {
      query: listCampaignsQuerySchema,
      output: listCampaignsOutputSchema,
    },
    '@get/api/campaigns/:id': {
      output: getCampaignOutputSchema,
    },
    '@post/api/campaigns': {
      input: createCampaignInputSchema,
      output: createCampaignOutputSchema,
    },
    '@put/api/campaigns/:id': {
      input: updateCampaignInputSchema,
      output: createCampaignOutputSchema,
    },
    '@delete/api/campaigns/:id': {},

    // Ad Slots
    '@get/api/ad-slots': {
      query: listAdSlotsQuerySchema,
      output: listAdSlotsOutputSchema,
    },
    '@get/api/ad-slots/:id': {
      output: getAdSlotOutputSchema,
    },
    '@post/api/ad-slots': {
      input: createAdSlotInputSchema,
      output: createAdSlotOutputSchema,
    },
    '@put/api/ad-slots/:id': {
      input: updateAdSlotInputSchema,
      output: createAdSlotOutputSchema,
    },
    '@delete/api/ad-slots/:id': {},
    '@post/api/ad-slots/:id/book': {
      input: bookAdSlotInputSchema,
      output: bookAdSlotOutputSchema,
    },
    '@post/api/ad-slots/:id/unbook': {
      output: unbookAdSlotOutputSchema,
    },

    // Placements
    '@get/api/placements': {
      query: listPlacementsQuerySchema,
      output: listPlacementsOutputSchema,
    },
    '@post/api/placements': {
      input: createPlacementInputSchema,
      output: createPlacementOutputSchema,
    },

    // Dashboard
    '@get/api/dashboard/stats': {
      output: getDashboardStatsOutputSchema,
    },

    // Newsletter
    '@post/api/newsletter': {
      input: subscribeNewsletterInputSchema,
      output: subscribeNewsletterOutputSchema,
    },

    // Quotes
    '@get/api/quotes': {
      output: listPublisherQuotesOutputSchema,
    },
    '@get/api/quotes/mine': {
      output: listUserQuotesOutputSchema,
    },
    '@post/api/quotes': {
      input: requestQuoteInputSchema,
      output: requestQuoteOutputSchema,
    },
    '@patch/api/quotes/:id/status': {
      input: updateQuoteStatusInputSchema,
      output: updateQuoteStatusOutputSchema,
    },
  }),
  plugins: [
    betterFetchLogger({
      enabled: process.env.NODE_ENV === 'development',
    }),
  ],
});
