const app = require('./server/src/app');
const { PORT, SUPER_ADMIN_PASSWORD } = require('./server/src/config');
const { sequelize } = require('./server/src/services');
const { Role, User } = require('./server/src/models');
const { encrypt } = require('./server/src/utils');

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
      await User.create({
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: await encrypt(SUPER_ADMIN_PASSWORD),
        roleId: roles[0].id,
      });
      // console.log('USERS: ', await User.findAll());
      // console.log('ROLES: ', await Role.findAll());
    } catch (error) {
      console.log('Error preparing the DB data', error);
    }
  })();
}
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
