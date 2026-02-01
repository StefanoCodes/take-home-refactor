import { z } from "zod";

/**
 * Enums (mirroring Prisma enums)
 */

export const subscriptionTierSchema = z.enum([
	"FREE",
	"STARTER",
	"PROFESSIONAL",
	"ENTERPRISE",
]);

export const campaignStatusSchema = z.enum([
	"DRAFT",
	"PENDING_REVIEW",
	"APPROVED",
	"ACTIVE",
	"PAUSED",
	"COMPLETED",
	"CANCELLED",
]);

export const creativeTypeSchema = z.enum([
	"BANNER",
	"VIDEO",
	"NATIVE",
	"SPONSORED_POST",
	"PODCAST_READ",
]);

export const adSlotTypeSchema = z.enum([
	"DISPLAY",
	"VIDEO",
	"NATIVE",
	"NEWSLETTER",
	"PODCAST",
]);

/** Values for campaign status (use in selects, filters). */
export const campaignStatusValues = campaignStatusSchema.options;

/** Values for ad slot type (use in selects, filters). */
export const adSlotTypeValues = adSlotTypeSchema.options;

export const pricingModelSchema = z.enum(["CPM", "CPC", "CPA", "FLAT_RATE"]);

export const placementStatusSchema = z.enum([
	"PENDING",
	"APPROVED",
	"ACTIVE",
	"PAUSED",
	"COMPLETED",
	"REJECTED",
]);

export const paymentTypeSchema = z.enum([
	"SUBSCRIPTION",
	"CAMPAIGN_FUNDING",
	"REFUND",
]);

export const paymentStatusSchema = z.enum([
	"PENDING",
	"PROCESSING",
	"COMPLETED",
	"FAILED",
	"REFUNDED",
]);

/**
 * Common response schemas
 */

export const errorResponseSchema = z.object({
	error: z.string(),
	status: z.number(),
	statusText: z.string(),
});

export const successResponseSchema = z.object({
	success: z.literal(true),
});

/**
 * TypeScript types
 */

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;
export type CreativeType = z.infer<typeof creativeTypeSchema>;
export type AdSlotType = z.infer<typeof adSlotTypeSchema>;
export type PricingModel = z.infer<typeof pricingModelSchema>;
export type PlacementStatus = z.infer<typeof placementStatusSchema>;
export type PaymentType = z.infer<typeof paymentTypeSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
