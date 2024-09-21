import usersModel from '../models/usersModel.mjs';

const isSuperUserMiddleware = async (req, res, next) => {
  const { email } = req.user;

  const foundUser = await usersModel.findOne({ email }).exec();

  if (foundUser.isSuperUser) {
    next();
  } else {
    next(new Error('This Opeation is Not Allowed!'));
  }
};

export default isSuperUserMiddleware;
