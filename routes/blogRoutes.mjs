import express from 'express';

import createBlog from '../controllers/createBlogController.mjs';
import deleteBlog from '../controllers/deleteBlogController.mjs';
import getBlogs, { getMyBlogs } from '../controllers/getAllBlogsController.mjs';
import getBlogById from '../controllers/getSingleBlogController.mjs';
import updateBlog from '../controllers/updateBlogController.mjs';
import {
  getFeaturedBlogs,
  getPopularBlogs,
  getBlogsByCategory,
  toggleFeatured,
} from '../controllers/featuredBlogsController.mjs';
import handleUpload from '../middlewares/handleUpload.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import upload from '../utilities/uploadFile.mjs';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/popular', getPopularBlogs);
router.get('/category/:category', getBlogsByCategory);

// Authenticated user routes
router.get('/my', authenticateToken, getMyBlogs);

// Admin routes
router.post(
  '/',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'blogImage' }, { name: 'authorImage' }]),
  handleUpload,
  createBlog
);

router.put('/:id/feature', authenticateToken, isSuperUserMiddleware, toggleFeatured);

router.get('/:id', getBlogById);
router.put(
  '/:id',
  authenticateToken,
  isSuperUserMiddleware,
  upload.fields([{ name: 'blogImage' }, { name: 'authorImage' }]),
  handleUpload,
  updateBlog
);
router.delete('/:id', authenticateToken, isSuperUserMiddleware, deleteBlog);

export default router;
