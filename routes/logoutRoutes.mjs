import express from 'express';
import logout from '../controllers/logoutController.mjs';

const router = express.Router();

router.route('/').post(logout);

export default router;
