import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  max: 1000,
  windowMs: 15 * 60 * 1000,
  message: 'too many requests sent by this ip',
});

export default limiter;
