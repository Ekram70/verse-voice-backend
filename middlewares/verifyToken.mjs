import BlacklistedToken from '../models/blacklistedTokenModel.mjs';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ status: 'fail' });

  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) return res.sendStatus(403);

    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ status: 'fail' });
      req.user = user;
      next();
    });
  } catch (error) {
    res.res.status(500).json({ status: 'fail' });
  }
}

export default authenticateToken;
