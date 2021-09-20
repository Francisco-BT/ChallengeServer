const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class Token extends Model {}

Token.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'tokens',
  }
);

module.exports = Token;
