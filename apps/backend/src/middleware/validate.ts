import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/**
 * Express middleware that validates `req.body` against a Zod schema (same zod schema the frontend used to send the body single source of truth).
 * Returns 400 with structured error details on failure.
 */
export function validateBody(schema: ZodSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			res.status(400).json({
				error: "Validation failed",
				details: errors,
			});
			return;
		}

		req.body = result.data;
		next();
	};
}
