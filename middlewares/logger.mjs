import { createWriteStream } from 'fs';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

logger.token('origin', (req) => req.headers.origin);
logger.token('error', (req) => req.error.name);
logger.token('message', (req) => req.error.name);

console.log(__dirname);

const accessLogStream = await createWriteStream(
  path.join(__dirname, '..', 'logs', 'access.txt'),
  { flags: 'a' }
);

const errorLogStream = await createWriteStream(
  path.join(__dirname, '..', 'logs', 'error.txt'),
  { flags: 'a' }
);

export const logAccessToFile = logger(
  '[:date[web]] \t :remote-addr \t :method \t :url \t HTTP/:http-version \t :status \t :origin',
  { stream: accessLogStream }
);

export const logErrorToFile = logger('[:date[web]] \t :error \t :message', {
  stream: errorLogStream,
});

export const logToConsole = logger(
  '[:date[iso]] - :method - :url - :status - :origin'
);
