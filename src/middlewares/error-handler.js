const DEFAULT_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  const { status, message, errors } = error;
  res.status(status || DEFAULT_STATUS_CODE).json({
    message: message || DEFAULT_ERROR_MESSAGE,
    timestamp: new Date().getTime(),
    errors,
  });
};