const jwt = require('jsonwebtoken');
const { JWT_ISSUER, JWT_SECRET, JWT_EXPIRATION } = require('../config');
const { Token } = require('../models');
const { TokenGenerationException } = require('./errors');

exports.generateToken = async (payload, model = Token) => {
  try {
    if (payload.id) {
      const token = jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS512',
        issuer: JWT_ISSUER,
        expiresIn: JWT_EXPIRATION,
      });

      await model.create({ token, userId: payload.id });

      return token;
    }
    throw new TokenGenerationException();
  } catch {
    throw new TokenGenerationException();
  }
};
