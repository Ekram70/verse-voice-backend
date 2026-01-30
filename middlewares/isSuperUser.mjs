import usersModel from '../models/usersModel.mjs';

const isSuperUserMiddleware = async (req, res, next) => {
  const { email } = req.user;

  const foundUser = await usersModel.findOne({ email }).exec();

  if (foundUser && foundUser.isSuperUser) {
    next();
  } else {
    return res.status(403).json({ message: 'This operation is not allowed!' });
  }
};

export default isSuperUserMiddleware;
