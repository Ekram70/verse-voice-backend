import express from 'express';
import {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  resendRegistrationOtp,
} from '../controllers/registrationOtpController.mjs';
import validateRegister from '../middlewares/validateRegister.mjs';
import validateRequest from '../middlewares/validateRequest.mjs';

const router = express.Router();

// Step 1: Send OTP to email
router.post('/send-otp', validateRegister, validateRequest, sendRegistrationOtp);

// Step 2: Verify OTP and complete registration
router.post('/verify-otp', verifyRegistrationOtp);

// Resend OTP if needed
router.post('/resend-otp', resendRegistrationOtp);

export default router;
