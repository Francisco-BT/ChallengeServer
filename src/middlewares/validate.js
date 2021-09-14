const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    return next();
  }
  const errors = {};
  validatorErrors.array().forEach(({ msg, param }) => (errors[param] = msg));
  res.status(400).json({ errors });
};
