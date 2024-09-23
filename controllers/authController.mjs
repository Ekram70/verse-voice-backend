import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersModel from '../models/usersModel.mjs';

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const foundUser = await usersModel.findOne({ email }).exec();

    if (!foundUser) {
      return res.status(401).json({ status: 'fail' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const payload = {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        admin: foundUser.isSuperUser,
      };

      let accessToken = '';

      if (rememberMe) {
        accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '7d',
        });
      } else {
        accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1d',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          user: payload,
        },
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.message });
  }
};

export default login;
