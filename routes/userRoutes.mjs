import express from 'express';
import { getCurrentUser, getUserById, updateProfile } from '../controllers/userController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import upload from '../utilities/uploadFile.mjs';

const router = express.Router();

router.get('/me', authenticateToken, getCurrentUser);
router.put(
  '/me',
  authenticateToken,
  upload.fields([{ name: 'avatar' }]),
  updateProfile
);
router.get('/:id', getUserById);

export default router;
