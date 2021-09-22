const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');

class TeamMovement extends Model {}

TeamMovement.init(
  {
    userId: {
      type: DataTypes.INTEGER,
    },
    accountId: {
      type: DataTypes.INTEGER,
    },
    userName: {
      type: DataTypes.STRING,
    },
    userEmail: {
      type: DataTypes.STRING,
    },
    accountName: {
      type: DataTypes.STRING,
    },
    operation: {
      type: DataTypes.ENUM,
      values: ['Create', 'Update', 'Delete'],
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    modelName: 'teamMovements',
  }
);

module.exports = TeamMovement;
