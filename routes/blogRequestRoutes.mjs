import express from 'express';
import {
  submitBlogRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  updateRequest,
  approveRequest,
  rejectRequest,
  deleteRequest,
} from '../controllers/blogRequestController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';
import isSuperUserMiddleware from '../middlewares/isSuperUser.mjs';
import upload from '../utilities/uploadFile.mjs';
import handleUpload from '../middlewares/handleUpload.mjs';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  upload.fields([{ name: 'blogImage' }, { name: 'authorImage' }]),
  handleUpload,
  submitBlogRequest
);

router.get('/', authenticateToken, isSuperUserMiddleware, getAllRequests);
router.get('/my', authenticateToken, getMyRequests);
router.get('/:id', authenticateToken, isSuperUserMiddleware, getRequestById);
router.put('/:id', authenticateToken, isSuperUserMiddleware, updateRequest);
router.put('/:id/approve', authenticateToken, isSuperUserMiddleware, approveRequest);
router.put('/:id/reject', authenticateToken, isSuperUserMiddleware, rejectRequest);
router.delete('/:id', authenticateToken, isSuperUserMiddleware, deleteRequest);

export default router;
