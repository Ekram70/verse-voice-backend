import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersModel from '../models/usersModel.mjs';

const registration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const duplicate = await usersModel.findOne({ email }).exec();

    if (duplicate) {
      return res.sendStatus(409);
    }

    const hashedPass = await bcrypt.hash(password, 7);
    const newUser = { name, email, password: hashedPass };
    const user = await usersModel.create(newUser);

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    await usersModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
        },
      }
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      status: 'success',
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.message });
  }
};

export default registration;
