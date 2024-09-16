import logger from 'morgan';

logger.token('origin', (req) => req.headers.origin);
logger.token('error', (req) => req.error.name);
logger.token('message', (req) => req.error.name);

export const logToConsole = logger(
  '[:date[iso]] - :method - :url - :status - :origin'
);
