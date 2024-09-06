import logEvents from './logEvents.mjs';

const errorHandler = async (err, req, res, next) => {
  await logEvents(`${err.name}: ${err.message}`, 'error.txt');
  res.status(500).send(err.message);
};

export default errorHandler;
