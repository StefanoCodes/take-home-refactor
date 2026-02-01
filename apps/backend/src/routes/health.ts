import { Router, type Request, type Response, type IRouter } from "express";
import { prisma } from "../db.js";
import { sendError } from "../utils/helpers.js";

const router: IRouter = Router();

// GET /api/health - Health check endpoint
router.get("/", async (_req: Request, res: Response) => {
	try {
		// Check database connection
		await prisma.$queryRaw`SELECT 1`;
		res.json({
			status: "ok",
			timestamp: new Date().toISOString(),
			database: "connected",
		});
	} catch (error) {
		console.error(error);
		sendError(res, 503, "Database disconnected");
	}
});

export default router;
