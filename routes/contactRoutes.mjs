import express from 'express';
import {
  submitContact,
  getAllContacts,
  markAsRead,
} from '../controllers/contactController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';

const router = express.Router();

router.post('/', submitContact);
router.get('/', authenticateToken, isSuperUserMiddleware, getAllContacts);
router.put('/:id/read', authenticateToken, isSuperUserMiddleware, markAsRead);

export default router;
