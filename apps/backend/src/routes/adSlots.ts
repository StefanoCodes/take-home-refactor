import { Router, type Request, type Response, type IRouter } from "express";
import {
	createAdSlotInputSchema,
	updateAdSlotInputSchema,
	bookAdSlotInputSchema,
} from "@anvara/schemas";
import { prisma } from "../db.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, type AuthRequest } from "../middleware/authenticate.js";
import { getOwnedPublisher, isPublisherOwner, isSponsorOwner } from "../middleware/authorize.js";
import { getParam, sendError } from "../utils/helpers.js";

const router: IRouter = Router();

// All ad-slot routes require authentication
router.use(requireAuth);

// GET /api/ad-slots - List ad slots for the authenticated user's publisher
router.get("/", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const { type, available } = req.query;

		const publisher = await getOwnedPublisher(user.id);

		if (!publisher) {
			res.json([]);
			return;
		}

		const adSlots = await prisma.adSlot.findMany({
			where: {
				publisherId: publisher.id,
				...(type && {
					type: type as string as
						| "DISPLAY"
						| "VIDEO"
						| "NATIVE"
						| "NEWSLETTER"
						| "PODCAST",
				}),
				...(available === "true" && { isAvailable: true }),
			},
			include: {
				publisher: {
					select: { id: true, name: true, category: true, monthlyViews: true },
				},
				_count: { select: { placements: true } },
			},
			orderBy: { basePrice: "desc" },
		});

		res.json(adSlots);
	} catch (error) {
		console.error("Error fetching ad slots:", error);
		sendError(res, 500, "Failed to fetch ad slots");
	}
});

// GET /api/ad-slots/:id - Get single ad slot (verify ownership)
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const id = getParam(req.params.id);

		const adSlot = await prisma.adSlot.findUnique({
			where: { id },
			include: {
				publisher: true,
				placements: {
					include: {
						campaign: { select: { id: true, name: true, status: true } },
					},
				},
			},
		});

		if (!adSlot) {
			sendError(res, 404, "Ad slot not found");
			return;
		}

		if (adSlot.publisher.userId !== user.id) {
			sendError(res, 403, "Forbidden");
			return;
		}

		res.json(adSlot);
	} catch (error) {
		console.error("Error fetching ad slot:", error);
		sendError(res, 500, "Failed to fetch ad slot");
	}
});

// POST /api/ad-slots - Create new ad slot (for user's publisher)
router.post(
	"/",
	validateBody(createAdSlotInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const { name, description, type, basePrice, publisherId } = req.body;

			if (!(await isPublisherOwner(publisherId, user.id))) {
				sendError(res, 403, "Forbidden");
				return;
			}

			const adSlot = await prisma.adSlot.create({
				data: {
					name,
					description,
					type,
					basePrice,
					publisherId,
				},
				include: {
					publisher: { select: { id: true, name: true } },
				},
			});

			res.status(201).json(adSlot);
		} catch (error) {
			console.error("Error creating ad slot:", error);
			sendError(res, 500, "Failed to create ad slot");
		}
	},
);

// POST /api/ad-slots/:id/book - Book an ad slot (verify sponsor ownership)
router.post(
	"/:id/book",
	validateBody(bookAdSlotInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const id = getParam(req.params.id);
			const { sponsorId, message } = req.body;

			if (!(await isSponsorOwner(sponsorId, user.id))) {
				sendError(res, 403, "Forbidden");
				return;
			}

			const adSlot = await prisma.adSlot.findUnique({
				where: { id },
				include: { publisher: true },
			});

			if (!adSlot) {
				sendError(res, 404, "Ad slot not found");
				return;
			}

			if (!adSlot.isAvailable) {
				sendError(res, 400, "Ad slot is no longer available");
				return;
			}

			const updatedSlot = await prisma.adSlot.update({
				where: { id },
				data: { isAvailable: false },
				include: {
					publisher: { select: { id: true, name: true } },
				},
			});

			console.log(
				`Ad slot ${id} booked by sponsor ${sponsorId}. Message: ${message || "None"}`,
			);

			res.json({
				success: true,
				message: "Ad slot booked successfully!",
				adSlot: updatedSlot,
			});
		} catch (error) {
			console.error("Error booking ad slot:", error);
			sendError(res, 500, "Failed to book ad slot");
		}
	},
);

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (verify publisher ownership)
router.post("/:id/unbook", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const id = getParam(req.params.id);

		const adSlot = await prisma.adSlot.findUnique({
			where: { id },
			include: { publisher: { select: { userId: true } } },
		});

		if (!adSlot) {
			sendError(res, 404, "Ad slot not found");
			return;
		}

		if (adSlot.publisher.userId !== user.id) {
			sendError(res, 403, "Forbidden");
			return;
		}

		const updatedSlot = await prisma.adSlot.update({
			where: { id },
			data: { isAvailable: true },
			include: {
				publisher: { select: { id: true, name: true } },
			},
		});

		res.json({
			success: true,
			message: "Ad slot is now available again",
			adSlot: updatedSlot,
		});
	} catch (error) {
		console.error("Error unbooking ad slot:", error);
		sendError(res, 500, "Failed to unbook ad slot");
	}
});

// PUT /api/ad-slots/:id - Update ad slot (verify ownership)
router.put(
	"/:id",
	validateBody(updateAdSlotInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const id = getParam(req.params.id);

			const adSlot = await prisma.adSlot.findUnique({
				where: { id },
				include: { publisher: { select: { userId: true } } },
			});

			if (!adSlot) {
				sendError(res, 404, "Ad slot not found");
				return;
			}

			if (adSlot.publisher.userId !== user.id) {
				sendError(res, 403, "Forbidden");
				return;
			}

			const updated = await prisma.adSlot.update({
				where: { id },
				data: req.body,
				include: {
					publisher: { select: { id: true, name: true } },
				},
			});

			res.json(updated);
		} catch (error) {
			console.error("Error updating ad slot:", error);
			sendError(res, 500, "Failed to update ad slot");
		}
	},
);

// DELETE /api/ad-slots/:id - Delete ad slot (verify ownership)
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const id = getParam(req.params.id);

		const adSlot = await prisma.adSlot.findUnique({
			where: { id },
			include: { publisher: { select: { userId: true } } },
		});

		if (!adSlot) {
			sendError(res, 404, "Ad slot not found");
			return;
		}

		if (adSlot.publisher.userId !== user.id) {
			sendError(res, 403, "Forbidden");
			return;
		}

		await prisma.adSlot.delete({ where: { id } });

		res.status(204).send();
	} catch (error) {
		console.error("Error deleting ad slot:", error);
		sendError(res, 500, "Failed to delete ad slot");
	}
});

export default router;
