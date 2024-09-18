import express from 'express';
import addComment from '../controllers/createCommentController.mjs';
import deleteComment from '../controllers/deleteCommentController.mjs';
import updateComment from '../controllers/updateCommentController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.route('/comments').post(authenticateToken, addComment);

router
  .route('/comments')
  .put(authenticateToken, updateComment)
  .delete(authenticateToken, deleteComment);

export default router;
