import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PendingUser from '../models/pendingUserModel.mjs';
import User from '../models/usersModel.mjs';
import htmlEmail from '../utilities/htmlEmail.mjs';
import sendEmailUtility from '../utilities/sendEmail.mjs';

// Send OTP for registration
export const sendRegistrationOtp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'An account with this email already exists',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 7);

    // Delete any existing pending registration for this email
    await PendingUser.deleteMany({ email });

    // Create pending user
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    await sendEmailUtility(
      email,
      htmlEmail(otp, 'registration'),
      'VerseVoice - Verify Your Email'
    );

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Registration OTP error:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Failed to send OTP',
    });
  }
};

// Verify OTP and complete registration
export const verifyRegistrationOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find pending user with matching OTP
    const pendingUser = await PendingUser.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired OTP',
      });
    }

    // Check if user was created in the meantime
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await PendingUser.deleteMany({ email });
      return res.status(409).json({
        status: 'fail',
        message: 'An account with this email already exists',
      });
    }

    // Create the actual user
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    // Delete pending user
    await PendingUser.deleteMany({ email });

    // Generate JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      admin: user.isSuperUser,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      status: 'success',
      data: {
        accessToken,
        user: payload,
      },
    });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Failed to verify OTP',
    });
  }
};

// Resend OTP for registration
export const resendRegistrationOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find pending user
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'No pending registration found. Please start over.',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update pending user with new OTP and expiration
    pendingUser.otp = otp;
    pendingUser.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pendingUser.save();

    // Send new OTP email
    await sendEmailUtility(
      email,
      htmlEmail(otp, 'registration'),
      'VerseVoice - Verify Your Email'
    );

    res.status(200).json({
      status: 'success',
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    console.error('Resend registration OTP error:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Failed to resend OTP',
    });
  }
};
