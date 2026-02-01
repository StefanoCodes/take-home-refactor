import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";
import type { Request, Response, NextFunction } from "express";

/**
 * Middleware that validates the Better Auth session cookie.
 * Attaches `req.user` and `req.session` on success, returns 401 otherwise.
 */
export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const result = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	if (!result) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	(req as AuthRequest).user = result.user;
	(req as AuthRequest).session = result.session;
	next();
}

/**
 * Authenticated request — `req.user` and `req.session` are
 * guaranteed to exist after `authenticate` middleware passes.
 */
export interface AuthRequest extends Request {
	user: {
		id: string;
		email: string;
		name: string;
		image?: string | null;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
	session: {
		id: string;
		userId: string;
		token: string;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date;
	};
}
