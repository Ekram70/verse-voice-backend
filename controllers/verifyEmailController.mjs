import otpModel from '../models/otpModel.mjs';
import usersModel from '../models/usersModel.mjs';
import htmlEmail from '../utilities/htmlEmail.mjs';
import sendEmailUtility from '../utilities/sendEmail.mjs';

const verifyEmail = async (req, res) => {
  let { email } = req.params;

  let OtpCode = Math.floor(100000 + Math.random() * 900000);

  try {
    let userCount = await usersModel.aggregate([
      { $match: { email: email } },
      { $count: 'total' },
    ]);

    if (userCount.length === 1) {
      let createOtp = await otpModel.create({ email: email, otp: OtpCode });
      let sendEmail = await sendEmailUtility(
        email,
        `${htmlEmail(OtpCode)}`,
        'Classroom Writers OTP Verification'
      );

      res.status(200).json({ status: 'success', data: sendEmail });
    } else {
      res.status(200).json({ status: 'fail', data: 'No user found' });
    }
  } catch (error) {
    console.log(error);

    res.status(200).json({ status: 'fail', data: error });
  }
};

export default verifyEmail;
