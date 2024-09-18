import express from 'express';
import likeBlog from '../controllers/likeController.mjs';
import unlikeBlog from '../controllers/unlikeController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.route('/:blogId/like').post(authenticateToken, likeBlog);
router.route('/:blogId/unlike').post(authenticateToken, unlikeBlog);

export default router;
