import express from 'express';
import {
  getSettings,
  updateSettings,
  uploadAboutImage,
  uploadSiteLogo,
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
router.put(
  '/site-logo',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'siteLogo' }]),
  uploadSiteLogo
);
router.put(
  '/about-image',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'aboutImage' }]),
  uploadAboutImage
);
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
