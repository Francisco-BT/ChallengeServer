const { ForbiddenException } = require('../utils/errors');

module.exports =
  (validRoles = []) =>
  (req, res, next) => {
    if (req.user) {
      const userRole = req.user.role;

      if (validRoles.includes(userRole)) {
        return next();
      }
    }

    next(new ForbiddenException());
  };
