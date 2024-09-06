import express from 'express';
import registration from '../controllers/registerController.mjs';
import validateRegister from '../middlewares/validateRegister.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';

const router = express.Router();

router.route('/').post(validateRegister, validateRequest, registration);

export default router;
