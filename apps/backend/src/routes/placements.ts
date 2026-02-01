import { Router, type Request, type Response, type IRouter } from 'express';
import { createPlacementInputSchema } from '@anvara/schemas';
import { prisma } from '../db.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth, type AuthRequest } from '../middleware/authenticate.js';
import { getOwnedSponsor, getOwnedPublisher } from '../middleware/authorize.js';
import { getParam, sendError } from '../utils/helpers.js';

const router: IRouter = Router();

// All placement routes require authentication
router.use(requireAuth);

// GET /api/placements - List placements scoped to the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const { campaignId, publisherId, status } = req.query;

    const [sponsor, publisher] = await Promise.all([
      getOwnedSponsor(user.id),
      getOwnedPublisher(user.id),
    ]);

    const placements = await prisma.placement.findMany({
      where: {
        ...(campaignId && { campaignId: getParam(campaignId) }),
        ...(publisherId && { publisherId: getParam(publisherId) }),
        ...(status && {
          status: status as string as
            | 'PENDING'
            | 'APPROVED'
            | 'REJECTED'
            | 'ACTIVE'
            | 'PAUSED'
            | 'COMPLETED',
        }),
        OR: [
          ...(sponsor ? [{ campaign: { sponsorId: sponsor.id } }] : []),
          ...(publisher ? [{ publisherId: publisher.id }] : []),
        ],
      },
      include: {
        campaign: { select: { id: true, name: true } },
        creative: { select: { id: true, name: true, type: true } },
        adSlot: { select: { id: true, name: true, type: true } },
        publisher: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(placements);
  } catch (error) {
    console.error('Error fetching placements:', error);
    sendError(res, 500, 'Failed to fetch placements');
  }
});

// POST /api/placements - Create new placement (verify ownership of the campaign)
router.post('/', validateBody(createPlacementInputSchema), async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const {
      campaignId,
      creativeId,
      adSlotId,
      publisherId,
      agreedPrice,
      pricingModel,
      startDate,
      endDate,
    } = req.body;

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { sponsor: { select: { userId: true } } },
    });

    if (!campaign) {
      sendError(res, 404, 'Campaign not found');
      return;
    }

    if (campaign.sponsor.userId !== user.id) {
      sendError(res, 403, 'Forbidden');
      return;
    }

    const placement = await prisma.placement.create({
      data: {
        campaignId,
        creativeId,
        adSlotId,
        publisherId,
        agreedPrice,
        pricingModel: pricingModel || 'CPM',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        campaign: { select: { name: true } },
        publisher: { select: { name: true } },
      },
    });

    res.status(201).json(placement);
  } catch (error) {
    console.error('Error creating placement:', error);
    sendError(res, 500, 'Failed to create placement');
  }
});

export default router;
