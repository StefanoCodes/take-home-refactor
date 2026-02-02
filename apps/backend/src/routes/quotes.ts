import { Router, type Request, type Response, type IRouter } from "express";
import {
	requestQuoteInputSchema,
	updateQuoteStatusInputSchema,
} from "@anvara/schemas";
import { prisma } from "../db.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, type AuthRequest } from "../middleware/authenticate.js";
import { getParam, sendError } from "../utils/helpers.js";

const router: IRouter = Router();

// All quote routes require authentication
router.use(requireAuth);

// GET /api/quotes/mine — Get current user's quote requests (optionally filtered by adSlotId)
router.get("/mine", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const adSlotId = req.query.adSlotId as string | undefined;

		const where: { userId: string; adSlotId?: string } = {
			userId: user.id,
		};
		if (adSlotId) {
			where.adSlotId = adSlotId;
		}

		const quotes = await prisma.quoteRequest.findMany({
			where,
			orderBy: { createdAt: "desc" },
		});

		res.json({
			data: quotes.map((q) => ({
				...q,
				createdAt: q.createdAt.toISOString(),
				updatedAt: q.updatedAt.toISOString(),
			})),
		});
	} catch (error) {
		console.error("Error fetching user quotes:", error);
		sendError(res, 500, "Failed to fetch quote requests");
	}
});

// GET /api/quotes — Get all quote requests for the publisher's ad slots
router.get("/", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;

		const publisher = await prisma.publisher.findUnique({
			where: { userId: user.id },
		});

		if (!publisher) {
			sendError(res, 403, "Not a publisher");
			return;
		}

		const quotes = await prisma.quoteRequest.findMany({
			where: {
				adSlot: {
					publisherId: publisher.id,
				},
			},
			include: {
				adSlot: {
					select: { id: true, name: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		res.json({
			data: quotes.map((q) => ({
				...q,
				createdAt: q.createdAt.toISOString(),
				updatedAt: q.updatedAt.toISOString(),
			})),
		});
	} catch (error) {
		console.error("Error fetching publisher quotes:", error);
		sendError(res, 500, "Failed to fetch quote requests");
	}
});

// POST /api/quotes — Request a quote for an ad slot
router.post(
	"/",
	validateBody(requestQuoteInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const { companyName, email, phone, message, adSlotId } = req.body;

			const adSlot = await prisma.adSlot.findUnique({
				where: { id: adSlotId },
			});

			if (!adSlot) {
				sendError(res, 404, "Ad slot not found");
				return;
			}

			const quoteRequest = await prisma.quoteRequest.create({
				data: {
					companyName,
					email,
					phone,
					message,
					adSlotId,
					userId: user.id,
				},
			});

			res.status(201).json({
				success: true,
				message: "Quote request submitted successfully",
				quoteId: quoteRequest.id,
			});
		} catch (error) {
			console.error("Error creating quote request:", error);
			sendError(res, 500, "Failed to submit quote request");
		}
	},
);

// PATCH /api/quotes/:id/status — Update quote request status (publisher only)
router.patch(
	"/:id/status",
	validateBody(updateQuoteStatusInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const id = getParam(req.params.id);
			const { status } = req.body;

			const publisher = await prisma.publisher.findUnique({
				where: { userId: user.id },
			});

			if (!publisher) {
				sendError(res, 403, "Not a publisher");
				return;
			}

			const quote = await prisma.quoteRequest.findUnique({
				where: { id },
			});

			if (!quote) {
				sendError(res, 404, "Quote request not found");
				return;
			}

			// Verify the quote's ad slot belongs to this publisher
			const adSlot = await prisma.adSlot.findUnique({
				where: { id: quote.adSlotId },
				select: { publisherId: true },
			});

			if (!adSlot || adSlot.publisherId !== publisher.id) {
				sendError(res, 403, "Not authorized to update this quote");
				return;
			}

			await prisma.quoteRequest.update({
				where: { id },
				data: { status },
			});

			res.json({
				success: true,
				message: `Quote status updated to ${status}`,
			});
		} catch (error) {
			console.error("Error updating quote status:", error);
			sendError(res, 500, "Failed to update quote status");
		}
	},
);

export default router;
