import { prisma } from "../db.js";

/**
 * Returns the sponsor record owned by the given user, or null.
 */
export async function getOwnedSponsor(userId: string) {
	return prisma.sponsor.findUnique({
		where: { userId },
		select: { id: true },
	});
}

/**
 * Returns the publisher record owned by the given user, or null.
 */
export async function getOwnedPublisher(userId: string) {
	return prisma.publisher.findUnique({
		where: { userId },
		select: { id: true },
	});
}

/**
 * Checks that a sponsor record belongs to the given user.
 * Returns true if `sponsor.userId === userId`.
 */
export async function isSponsorOwner(sponsorId: string, userId: string) {
	const sponsor = await prisma.sponsor.findUnique({
		where: { id: sponsorId },
		select: { userId: true },
	});
	return sponsor?.userId === userId;
}

/**
 * Checks that a publisher record belongs to the given user.
 * Returns true if `publisher.userId === userId`.
 */
export async function isPublisherOwner(publisherId: string, userId: string) {
	const publisher = await prisma.publisher.findUnique({
		where: { id: publisherId },
		select: { userId: true },
	});
	return publisher?.userId === userId;
}
