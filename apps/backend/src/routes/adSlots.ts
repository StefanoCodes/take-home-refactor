import { Router, type Request, type Response, type IRouter } from "express";
import {
	createAdSlotInputSchema,
	updateAdSlotInputSchema,
	bookAdSlotInputSchema,
} from "@anvara/schemas";
import { prisma } from "../db.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, type AuthRequest } from "../middleware/authenticate.js";
import { isPublisherOwner, isSponsorOwner } from "../middleware/authorize.js";
import { getParam, sendError } from "../utils/helpers.js";

const router: IRouter = Router();

// All ad-slot routes require authentication
router.use(requireAuth);

// GET /api/ad-slots - List ad slots with pagination and filters
router.get("/", async (req: Request, res: Response) => {
	try {
		const { type, available, publisherId } = req.query;
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 6));
		const skip = (page - 1) * limit;

		const where = {
			...(publisherId && { publisherId: publisherId as string }),
			...(type && {
				type: type as string as
					| "DISPLAY"
					| "VIDEO"
					| "NATIVE"
					| "NEWSLETTER"
					| "PODCAST",
			}),
			...(available === "true" && { isAvailable: true }),
		};

		const [adSlots, total] = await Promise.all([
			prisma.adSlot.findMany({
				where,
				include: {
					publisher: {
						select: {
							id: true,
							name: true,
							category: true,
							monthlyViews: true,
						},
					},
					_count: { select: { placements: true } },
				},
				orderBy: { basePrice: "desc" },
				skip,
				take: limit,
			}),
			prisma.adSlot.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		res.json({
			data: adSlots,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasMore: page < totalPages,
			},
		});
	} catch (error) {
		console.error("Error fetching ad slots:", error);
		sendError(res, 500, "Failed to fetch ad slots");
	}
});

// GET /api/ad-slots/:id - Get single ad slot
router.get("/:id", async (req: Request, res: Response) => {
	try {
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

			res.status(201).json({
				...adSlot,
				basePrice: Number(adSlot.basePrice),
				cpmFloor: adSlot.cpmFloor ? Number(adSlot.cpmFloor) : null,
			});
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
				adSlot: {
					...updatedSlot,
					basePrice: Number(updatedSlot.basePrice),
					cpmFloor: updatedSlot.cpmFloor ? Number(updatedSlot.cpmFloor) : null,
				},
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
			adSlot: {
				...updatedSlot,
				basePrice: Number(updatedSlot.basePrice),
				cpmFloor: updatedSlot.cpmFloor ? Number(updatedSlot.cpmFloor) : null,
			},
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

			res.json({
				...updated,
				basePrice: Number(updated.basePrice),
				cpmFloor: updated.cpmFloor ? Number(updated.cpmFloor) : null,
			});
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
