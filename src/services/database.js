const { POSTGRES_CONNECTION_STRING, NODE_ENV } = require('../config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(POSTGRES_CONNECTION_STRING, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl:
      NODE_ENV === 'test'
        ? false
        : {
            require: true,
            rejectUnauthorized: false,
          },
  },
});

module.exports = sequelize;
