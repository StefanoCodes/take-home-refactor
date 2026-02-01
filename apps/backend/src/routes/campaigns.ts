import { Router, type Request, type Response, type IRouter } from 'express';
import { createCampaignInputSchema, updateCampaignInputSchema } from '@anvara/schemas';
import { prisma } from '../db.js';
import { validateBody } from '../middleware/validate.js';
import { requireAuth, type AuthRequest } from '../middleware/authenticate.js';
import { getOwnedSponsor, isSponsorOwner } from '../middleware/authorize.js';
import { getParam, sendError } from '../utils/helpers.js';

const router: IRouter = Router();

// All campaign routes require authentication
router.use(requireAuth);

// GET /api/campaigns - List campaigns for the authenticated user's sponsor
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const { status } = req.query;

    const sponsor = await getOwnedSponsor(user.id);

    if (!sponsor) {
      res.json([]);
      return;
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        sponsorId: sponsor.id,
        ...(status && { status: status as string as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    sendError(res, 500, 'Failed to fetch campaigns');
  }
});

// GET /api/campaigns/:id - Get single campaign (verify ownership)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const id = getParam(req.params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      sendError(res, 404, 'Campaign not found');
      return;
    }

    if (campaign.sponsor.userId !== user.id) {
      sendError(res, 403, 'Forbidden');
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    sendError(res, 500, 'Failed to fetch campaign');
  }
});

// POST /api/campaigns - Create new campaign (for user's sponsor)
router.post('/', validateBody(createCampaignInputSchema), async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      sponsorId,
    } = req.body;

    if (!(await isSponsorOwner(sponsorId, user.id))) {
      sendError(res, 403, 'Forbidden');
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    sendError(res, 500, 'Failed to create campaign');
  }
});

// PUT /api/campaigns/:id - Update campaign (verify ownership)
router.put('/:id', validateBody(updateCampaignInputSchema), async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const id = getParam(req.params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
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

    const { startDate, endDate, ...rest } = req.body;

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating campaign:', error);
    sendError(res, 500, 'Failed to update campaign');
  }
});

// DELETE /api/campaigns/:id - Delete campaign (verify ownership)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    const id = getParam(req.params.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
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

    await prisma.campaign.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    sendError(res, 500, 'Failed to delete campaign');
  }
});

export default router;
