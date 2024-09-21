import express from 'express';

import createBlog from '../controllers/createBlogController.mjs';
import deleteBlog from '../controllers/deleteBlogController.mjs';
import getBlogs from '../controllers/getAllBlogsController.mjs';
import getBlogById from '../controllers/getSingleBlogController.mjs';
import updateBlog from '../controllers/updateBlogController.mjs';
import handleUpload from '../middlewares/handleUpload.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import upload from '../utilities/uploadFile.mjs';

const router = express.Router();

router
  .route('/')
  .get(getBlogs)
  .post(authenticateToken, upload.single('image'), handleUpload, createBlog);

router
  .route('/:id')
  .get(getBlogById)
  .put(authenticateToken, updateBlog)
  .delete(authenticateToken, deleteBlog);

export default router;
