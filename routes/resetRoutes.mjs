import express from 'express';
import resetPassword from '../controllers/resetPasswordController.mjs';
import verifyEmail from '../controllers/verifyEmailController.mjs';
import verifyOtp from '../controllers/verifyOtpController.mjs';

const router = express.Router();

router.get('/verifyEmail/:email', verifyEmail);
router.get('/verifyOTP/:email/:otp', verifyOtp);
router.post('/resetPass', resetPassword);

export default router;
