import otpModel from '../models/otpModel.mjs';

const verifyOtp = async (req, res) => {
  let { email, otp } = req.params;

  try {
    let otpCount = await otpModel.aggregate([
      { $match: { email: email, otp: otp, status: 0 } },
      { $count: 'total' },
    ]);

    if (otpCount.length === 1) {
      await otpModel.updateOne(
        { email: email },
        { email: email, otp: otp, status: 1 }
      );

      res.status(200).json({ status: 'success', data: 'Otp Updated' });
    } else {
      res.status(200).json({ status: 'fail', data: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(200).json({ status: 'fail', data: error });
  }
};

export default verifyOtp;

// improve this code
