const { POSTGRES_CONNECTION_STRING } = require('../config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(POSTGRES_CONNECTION_STRING, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
