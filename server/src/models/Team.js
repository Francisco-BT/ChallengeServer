const { Model } = require('sequelize');
const { sequelize } = require('../services');
const Account = require('./Account');
const User = require('./User');
const TeamMovement = require('./TeamMovement');

class Team extends Model {}

Team.init(
  {},
  {
    sequelize,
    modelName: 'teams',
  }
);

Team.afterBulkCreate('logTeamCreation', async (team) => {
  const movements = [];
  for (const member of team) {
    const account = await Account.findByPk(member.accountId);
    const memberData = await User.findByPk(member.userId);
    movements.push({
      userId: memberData.id,
      accountId: account.id,
      userName: memberData.name,
      userEmail: memberData.email,
      accountName: account.name,
      operation: 'Create',
      startDate: member.createdAt,
      endDate: null,
    });
  }
  await TeamMovement.bulkCreate(movements);
});

Team.afterDestroy('logTeamMemberDelete', async (teamMember) => {
  const account = await Account.findByPk(teamMember.accountId);
  const user = await User.findByPk(teamMember.userId);
  await TeamMovement.create({
    userId: user.id,
    accountId: account.id,
    userName: user.name,
    userEmail: user.email,
    accountName: account.name,
    operation: 'Delete',
    startDate: teamMember.createdAt,
    endDate: new Date(),
  });
});

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
