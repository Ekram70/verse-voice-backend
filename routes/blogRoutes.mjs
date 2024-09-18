import express from 'express';

import createBlog from '../controllers/createBlogController.mjs';
import deleteBlog from '../controllers/deleteBlogController.mjs';
import getBlogs from '../controllers/getAllBlogsController.mjs';
import getBlogById from '../controllers/getSingleBlogController.mjs';
import updateBlog from '../controllers/updateBlogController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.route('/').get(getBlogs).post(authenticateToken, createBlog);

router
  .route('/:id')
  .get(getBlogById)
  .put(authenticateToken, updateBlog)
  .delete(authenticateToken, deleteBlog);

export default router;
