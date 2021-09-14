const DEFAULT_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  const {
    status = DEFAULT_STATUS_CODE,
    message = DEFAULT_ERROR_MESSAGE,
    errors,
  } = error;
  res.status(status).json({ message, timestamp: new Date().getTime(), errors });
};
