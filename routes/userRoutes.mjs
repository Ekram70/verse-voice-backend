import express from 'express';
import { getCurrentUser, getUserById, updateProfile } from '../controllers/userController.mjs';
import { getAllUsers, toggleBanUser, deleteUser } from '../controllers/adminUserController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';
import upload from '../utilities/uploadFile.mjs';

const router = express.Router();

router.get('/me', authenticateToken, getCurrentUser);
router.put(
  '/me',
  authenticateToken,
  upload.fields([{ name: 'avatar' }]),
  updateProfile
);

// Admin routes
router.get('/admin/all', authenticateToken, isSuperUserMiddleware, getAllUsers);
router.patch('/:id/ban', authenticateToken, isSuperUserMiddleware, toggleBanUser);
router.delete('/:id', authenticateToken, isSuperUserMiddleware, deleteUser);

router.get('/:id', getUserById);

export default router;
