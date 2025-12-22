import express from 'express';
import { subscribe, getSubscribers, deleteSubscriber } from '../controllers/newsletterController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';

const router = express.Router();

router.post('/', subscribe);
router.get('/', authenticateToken, isSuperUserMiddleware, getSubscribers);
router.delete('/:id', authenticateToken, isSuperUserMiddleware, deleteSubscriber);

export default router;
