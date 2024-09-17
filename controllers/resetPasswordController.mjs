import otpModel from '../models/otpModel.mjs';
import usersModel from '../models/usersModel.mjs';

const resetPassword = async (req, res) => {
  let { email, otp, password } = req.body;

  try {
    let otpCount = await otpModel.aggregate([
      { $match: { email: email, otp: otp, status: 1 } },
      { $count: 'total' },
    ]);

    const hashedPass = await bcrypt.hash(password, 7);

    if (otpCount.length === 1) {
      await usersModel.updateOne(
        { email },
        {
          password: hashedPass,
        }
      );

      res
        .status(200)
        .json({ status: 'success', data: 'Password Updated Successfully' });
    } else {
      res.status(200).json({ status: 'fail', data: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(200).json({ status: 'fail', data: error });
  }
};

export default resetPassword;
