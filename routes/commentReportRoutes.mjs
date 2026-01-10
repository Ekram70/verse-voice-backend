import express from 'express';
import {
  reportComment,
  getAllReports,
  updateReportStatus,
  deleteReport,
  deleteReportedComment,
} from '../controllers/commentReportController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';

const router = express.Router();

// User reports a comment
router.post('/', authenticateToken, reportComment);

// Admin routes
router.get('/', authenticateToken, isSuperUserMiddleware, getAllReports);
router.put('/:id/status', authenticateToken, isSuperUserMiddleware, updateReportStatus);
router.delete('/:id', authenticateToken, isSuperUserMiddleware, deleteReport);
router.delete('/:id/comment', authenticateToken, isSuperUserMiddleware, deleteReportedComment);

export default router;
