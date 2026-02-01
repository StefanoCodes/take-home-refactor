import { Router, type Request, type Response, type IRouter } from "express";
import { createSponsorInputSchema } from "@anvara/schemas";
import { prisma } from "../db.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, type AuthRequest } from "../middleware/authenticate.js";
import { getParam, sendError } from "../utils/helpers.js";

const router: IRouter = Router();

// All sponsor routes require authentication
router.use(requireAuth);

// GET /api/sponsors - List sponsors (only the authenticated user's sponsor)
router.get("/", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;

		const sponsors = await prisma.sponsor.findMany({
			where: { userId: user.id },
			include: {
				_count: {
					select: { campaigns: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
		res.json(sponsors);
	} catch (error) {
		console.error("Error fetching sponsors:", error);
		sendError(res, 500, "Failed to fetch sponsors");
	}
});

// GET /api/sponsors/:id - Get single sponsor (verify ownership)
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const { user } = req as AuthRequest;
		const id = getParam(req.params.id);
		const sponsor = await prisma.sponsor.findUnique({
			where: { id },
			include: {
				campaigns: {
					include: {
						_count: { select: { placements: true } },
					},
				},
				payments: {
					orderBy: { createdAt: "desc" },
					take: 5,
				},
			},
		});

		if (!sponsor) {
			sendError(res, 404, "Sponsor not found");
			return;
		}

		if (sponsor.userId !== user.id) {
			sendError(res, 403, "Forbidden");
			return;
		}

		res.json(sponsor);
	} catch (error) {
		console.error("Error fetching sponsor:", error);
		sendError(res, 500, "Failed to fetch sponsor");
	}
});

// POST /api/sponsors - Create new sponsor
router.post(
	"/",
	validateBody(createSponsorInputSchema),
	async (req: Request, res: Response) => {
		try {
			const { user } = req as AuthRequest;
			const { name, email, website, logo, description, industry } = req.body;

			const sponsor = await prisma.sponsor.create({
				data: {
					name,
					email,
					website,
					logo,
					description,
					industry,
					userId: user.id,
				},
			});

			res.status(201).json(sponsor);
		} catch (error) {
			console.error("Error creating sponsor:", error);
			sendError(res, 500, "Failed to create sponsor");
		}
	},
);

// TODO: Add PUT /api/sponsors/:id endpoint
// Update sponsor details

export default router;
