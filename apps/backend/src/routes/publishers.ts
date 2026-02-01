import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { requireAuth, type AuthRequest } from '../middleware/authenticate.js';
import { getParam, sendError } from '../utils/helpers.js';

const router: IRouter = Router();

// All publisher routes require authentication
router.use(requireAuth);

// GET /api/publishers - List publishers (only the authenticated user's publisher)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;

    const publishers = await prisma.publisher.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { adSlots: true, placements: true },
        },
      },
      orderBy: { monthlyViews: 'desc' },
    });
    res.json(publishers);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    sendError(res, 500, 'Failed to fetch publishers');
  }
});

// GET /api/publishers/:id - Get single publisher (verify ownership)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const id = getParam(req.params.id);

    const publisher = await prisma.publisher.findUnique({
      where: { id },
      include: {
        adSlots: true,
        placements: {
          include: {
            campaign: { select: { name: true, sponsor: { select: { name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!publisher) {
      sendError(res, 404, 'Publisher not found');
      return;
    }

    if (publisher.userId !== user.id) {
      sendError(res, 403, 'Forbidden');
      return;
    }

    res.json(publisher);
  } catch (error) {
    console.error('Error fetching publisher:', error);
    sendError(res, 500, 'Failed to fetch publisher');
  }
});

export default router;
