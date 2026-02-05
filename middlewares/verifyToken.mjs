import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/blacklistedTokenModel.mjs';
import User from '../models/usersModel.mjs';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ status: 'fail' });

  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) return res.status(403).json({ status: 'fail' });

      const dbUser = await User.findById(user.id).select('isBanned').lean();
      if (!dbUser) return res.status(401).json({ status: 'fail', message: 'Account no longer exists' });
      if (dbUser.isBanned) return res.status(403).json({ status: 'fail', message: 'Your account has been banned' });

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ status: 'fail' });
  }
}

export default authenticateToken;
