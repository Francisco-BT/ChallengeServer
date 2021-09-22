const app = require('./src/app');
const { PORT } = require('./src/config');
const { sequelize } = require('./src/services');
const { Role, User } = require('./src/models');
const { encrypt } = require('./src/utils');
const { createUsers, createAccounts } = require('./test/integration/utils');

// TODO: replace this logic by sequelize's seeds and migrations
if (process.env.NODE_ENV === 'test') {
  (async () => {
    try {
      await sequelize.sync({ force: true });
      console.log('End sequelize sync');
      const roles = await Role.bulkCreate([
        {
          name: 'SuperAdmin',
          description: 'Special role with all the privileges',
        },
        { name: 'Admin', description: 'Admin can create new users' },
        {
          name: 'Normal',
          description: 'Normal user just can edit his information',
        },
      ]);
      // TODO: add Role as SuperAdmin
      await User.create({
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: await encrypt('123456'),
        roleId: roles[0].id,
      });
      await createUsers(4);
      await createAccounts(2);
      // console.log('USERS: ', await User.findAll());
      // console.log('ROLES: ', await Role.findAll());
    } catch (error) {
      console.log('Error preparing the DB data', error);
    }
  })();
}
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
