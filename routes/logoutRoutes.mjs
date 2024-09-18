import express from 'express';
import logout from '../controllers/logoutController.mjs';
import authenticateToken from '../middlewares/verifyToken.mjs';

const router = express.Router();

router.route('/').post(authenticateToken, logout);

export default router;
