import { Router, type Request, type Response, type IRouter } from 'express';
import { requireAuth, type AuthRequest } from '../middleware/authenticate.js';
import { prisma } from '../db.js';
import { getParam, sendError } from '../utils/helpers.js';

const router: IRouter = Router();

// POST /api/auth/login - Placeholder (Better Auth handles login via frontend)
router.post('/login', async (_req: Request, res: Response) => {
  sendError(res, 400, 'Use the frontend login at /login instead');
});

// GET /api/auth/me - Get current authenticated user
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const { user } = req as AuthRequest;
  res.json({ user });
});

// GET /api/auth/role/:userId - Get user role based on Sponsor/Publisher records
router.get('/role/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const userId = getParam(req.params.userId);

    if (user.id !== userId) {
      sendError(res, 403, 'Forbidden');
      return;
    }

    // Check if user is a sponsor
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (sponsor) {
      res.json({ role: 'sponsor', sponsorId: sponsor.id, name: sponsor.name });
      return;
    }

    // Check if user is a publisher
    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (publisher) {
      res.json({
        role: 'publisher',
        publisherId: publisher.id,
        name: publisher.name,
      });
      return;
    }

    res.json({ role: null });
  } catch (error) {
    console.error('Error fetching user role:', error);
    sendError(res, 500, 'Failed to fetch user role');
  }
});

export default router;
