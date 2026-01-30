import express from 'express';
import addComment from '../controllers/createCommentController.mjs';
import deleteComment from '../controllers/deleteCommentController.mjs';
import updateComment from '../controllers/updateCommentController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.post('/:blogId/comments', authenticateToken, addComment);
router.put('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

export default router;
