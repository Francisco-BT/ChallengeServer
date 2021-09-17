const { User, Role } = require('../../src/models');
const { encrypt } = require('../../src/utils');

exports.createUsers = async (quantity) => {
  const role = await Role.create({ name: 'Test' });
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

exports.getAuthToken = async (request, app) => {
  const user = (await exports.createUsers(1))[0];
  const response = await request(app)
    .post('/api/v1/users/auth')
    .send({ email: user.email, password: 'User1' });
  return response.body.token;
};
