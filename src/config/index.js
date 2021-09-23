const { env } = process;
const path = require('path');

require('dotenv').config({
  path: path.resolve(
    process.cwd(),
    `.env${env.NODE_ENV === 'production' ? '' : `.${env.NODE_ENV}`}`
  ),
});

module.exports = {
  PORT: parseInt(env.PORT, 10) || 3000,
  NODE_ENV: String(env.NODE_ENV || 'developtment'),
  POSTGRES_CONNECTION_STRING: String(env.POSTGRES_CONNECTION_STRING),
  JWT_SECRET: String(env.JWT_SECRET),
  JWT_ISSUER: String(env.JWT_ISSUER),
  JWT_EXPIRATION: String(env.JWT_EXPIRATION || '30m'),
  TEAM_MOVEMENTS_LOG_DEFAULT_ITEMS_PER_PAGE:
    parseInt(env.TEAM_MOVEMENTS_LOG_DEFAULT_ITEMS_PER_PAGE, 10) || 30,
  TEAM_MOVEMENTS_LOG_MAX_LIMIT_PER_PAGE:
    parseInt(env.TEAM_MOVEMENTS_LOG_MAX_LIMIT_PER_PAGE, 10) || 200,
};
