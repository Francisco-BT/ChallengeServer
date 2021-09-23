const { User, Role, Account, Team } = require('../../src/models');
const { encrypt, generateToken } = require('../../src/utils');

const useRole = async (name) => {
  const existingRole = await Role.findOne({ where: { name } });
  return existingRole ? existingRole : await Role.create({ name });
};

exports.createUsers = async (quantity) => {
  const role = await useRole('Normal');
  const users = [];
  for (let i = 0; i < quantity; i += 1) {
    const number = i + 1;
    users.push({
      name: `User ${number}`,
      email: `user${number}@mail.com`,
      password: await encrypt(`User${number}`),
      englishLevel: 'A1',
      cvLink: 'www.google.com',
      roleId: role.id,
    });
  }

  const usersInDB = await User.bulkCreate(users);
  return usersInDB;
};

exports.getAuthToken = async (agent, roleName = 'SuperAdmin') => {
  const role = await useRole(roleName);
  const user = await User.create({
    name: 'Super Admin',
    email: `admin${new Date().getTime()}@admin.com`,
    password: await encrypt('1234'),
    englishLevel: 'A1',
    cvLink: 'www.google.com',
    roleId: role.id,
  });
  const response = await agent
    .post('/api/v1/users/auth')
    .send({ email: user.email, password: '1234' });
  return response.body.token;
};

exports.getFakeToken = async (id) => {
  return await generateToken({ id });
};

exports.createAccounts = async (quantity) => {
  const newAccounts = [];
  for (let i = 1; i <= quantity; i++) {
    newAccounts.push({
      name: `Account ${i + new Date().getTime()}`,
      clientName: `Client ${i}`,
      responsibleName: `Responsible ${i}`,
    });
  }
  return await Account.bulkCreate(newAccounts);
};

exports.createTeam = async () => {
  const account = (await exports.createAccounts(1))[0];
  const user = (await exports.createUsers(1))[0];
  const team = await Team.create({
    userId: user.id,
    accountId: account.id,
  });
  return team;
};

exports.createTeams = async () => {
  const accounts = await exports.createAccounts(2);
  const users = await exports.createUsers(3);

  const newTeams = [];
  for (const account of accounts) {
    for (const user of users) {
      newTeams.push({
        accountId: account.id,
        userId: user.id,
      });
    }
  }

  const teams = await Team.bulkCreate(newTeams);
  return { teams, accounts, users };
};
