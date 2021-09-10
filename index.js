const app = require('./src/app');
const { PORT } = require('./src/config');
const { sequelize } = require('./src/services');
const { Role } = require('./src/models');

// TODO: replace this logic by sequelize's seeds and migrations
if (process.env.NODE_ENV !== 'test') {
  console.log('Enter if to fill db');
  sequelize.sync({ force: true }).then(
    () => {
      console.log('End sync');
      Role.bulkCreate([
        {
          name: 'SuperAdmin',
          description: 'Special role with all the privileges',
        },
        { name: 'Admin', description: 'Admin can create new users' },
        {
          name: 'Normal',
          description: 'Normal user just can edit his information',
        },
      ]).then(
        () => console.log('Create roles finished'),
        (err) => console.log('Create roles error: ', err)
      );
    },
    (err) => console.log('Error sync DB', err)
  );
}

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
