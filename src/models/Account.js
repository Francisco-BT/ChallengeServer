const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class Account extends Model {}

Account.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsibleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'accounts',
  }
);

module.exports = Account;
