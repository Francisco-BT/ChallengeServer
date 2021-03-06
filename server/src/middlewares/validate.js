const { validationResult } = require('express-validator');
const { ValidationsException } = require('../utils/errors');

module.exports = (req, res, next) => {
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    return next();
  }
  const errors = {};
  validatorErrors.array().forEach(({ msg, param, location }) => (errors[param || location] = msg));
  next(new ValidationsException(errors));
};
