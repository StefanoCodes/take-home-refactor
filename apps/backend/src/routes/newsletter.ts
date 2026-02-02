import { Router, type Request, type Response, type IRouter } from 'express';
import { subscribeNewsletterInputSchema } from '@anvara/schemas';
import { prisma } from '../db.js';
import { validateBody } from '../middleware/validate.js';
import { sendError } from '../utils/helpers.js';

const router: IRouter = Router();

// POST /api/newsletter — Subscribe to newsletter (no auth required)
router.post(
  '/',
  validateBody(subscribeNewsletterInputSchema),
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: { email },
      });

      res.json({
        success: true,
        message: 'Thanks for subscribing!',
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      sendError(res, 500, 'Failed to subscribe');
    }
  }
);

export default router;
