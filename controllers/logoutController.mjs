import BlacklistedToken from '../models/blacklistedTokenModel.mjs';

const logout = async (req, res) => {
  const token = req.headers['Authorization']?.split(' ')[1];

  if (!token) return res.status(400).json({ status: 'fail' });

  const decoded = jwt.decode(token);
  const expiryTime = decoded.exp * 1000;

  try {
    const blacklistedToken = new BlacklistedToken({
      token,
      expiresAt: new Date(expiryTime),
    });
    await blacklistedToken.save();

    res.status(204).json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'fail' });
  }
};

export default logout;
