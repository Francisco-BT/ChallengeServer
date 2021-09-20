const { User, Role } = require('../../src/models');
const { encrypt, generateToken } = require('../../src/utils');

exports.createUsers = async (quantity) => {
  const role = await Role.create({ name: 'Normal' });
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
  const existRole = await Role.findOne({ where: { name: roleName } });
  const role = existRole ? existRole : await Role.create({ name: roleName });
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

exports.getFakeToken = async () => {
  return await generateToken({ id: -1 });
};
