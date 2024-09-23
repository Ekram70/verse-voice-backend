import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersModel from '../models/usersModel.mjs';

const registration = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const duplicate = await usersModel.findOne({ email }).exec();

    if (duplicate) {
      return res.status(409).json({ status: 'fail' });
    }

    const hashedPass = await bcrypt.hash(password, 7);
    const newUser = { name, email, password: hashedPass };
    const user = await usersModel.create(newUser);

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
      accessToken,
      user: payload,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.message });
  }
};

export default registration;
