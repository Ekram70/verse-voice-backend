import allowedOrigins from '../config/allowedOrigins.mjs';

const credentials = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Credentials', true);
  }

  next();
};

export default credentials;
