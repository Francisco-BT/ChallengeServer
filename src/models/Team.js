const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../services');
const Account = require('./Account');
const User = require('./User');

class Team extends Model {}

Team.init(
  {
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'teams',
  }
);

Account.belongsToMany(User, {
  through: Team,
  as: 'accountId',
  onDelete: 'CASCADE',
});
User.belongsToMany(Account, {
  through: Team,
  as: 'userId',
  onDelete: 'CASCADE',
});

module.exports = Team;
