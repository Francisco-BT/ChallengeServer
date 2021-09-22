const { Model } = require('sequelize');
const { sequelize } = require('../services');
const Account = require('./Account');
const User = require('./User');

class Team extends Model {}

Team.init(
  {},
  {
    sequelize,
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
