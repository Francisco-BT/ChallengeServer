const { ErrorLog } = require('../models');
const DEFAULT_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = 'Internal Server Error';

// eslint-disable-next-line no-unused-vars
module.exports = async (error, req, res, next) => {
  const { status, message, errors } = error;
  const timestamp = new Date().getTime();
  let errorPayload = {};
  try {
    errorPayload = {
      method: req.method,
      path: req.path,
      headers: JSON.parse(JSON.stringify(req.headers)),
      timestamp,
      query: JSON.parse(JSON.stringify(req.query)),
      body: JSON.parse(JSON.stringify(req.body)),
      errors,
      statusCode: status || DEFAULT_STATUS_CODE,
      ip: req.ip,
      message: message || DEFAULT_ERROR_MESSAGE,
      errorClass: error.name,
    };
    await ErrorLog.create(errorPayload);
  } catch (e) {
    console.log(`Error saving ${errorPayload}, reason: `, e);
  }

  res.status(status || DEFAULT_STATUS_CODE).json({
    message: message || DEFAULT_ERROR_MESSAGE,
    timestamp: new Date().getTime(),
    errors,
  });
};
