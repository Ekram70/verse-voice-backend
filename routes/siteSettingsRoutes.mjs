import express from 'express';
import {
  getSettings,
  updateSettings,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/siteSettingsController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';
import upload from '../utilities/uploadFile.mjs';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticateToken, isSuperUserMiddleware, updateSettings);
router.post(
  '/categories',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'categoryImage' }]),
  addCategory
);
router.put(
  '/categories/:name',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'categoryImage' }]),
  updateCategory
);
router.delete('/categories/:name', authenticateToken, isSuperUserMiddleware, deleteCategory);

export default router;
