import express from 'express';
import login from '../controllers/authController.mjs';
import validateLogin from '../middlewares/authValidation.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';

const router = express.Router();

router.route('/').post(validateLogin, validateRequest, login);

export default router;
