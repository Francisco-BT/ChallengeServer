const { JWT_ISSUER, JWT_SECRET, JWT_EXPIRATION } = require('../config');
const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS512',
    issuer: JWT_ISSUER,
    expiresIn: JWT_EXPIRATION,
  });
};
