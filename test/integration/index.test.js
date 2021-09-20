const { sequelize } = require('../../src/services');
const userTestsSuite = require('./users.testsuite');
const roleTestsSuite = require('./roles.testsuite');
const publicTestsSuite = require('./public.testsuite');

// Run test in sequence to prevent race conditions cleaning up the DB
describe('Integration Test', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => await sequelize.close());

  publicTestsSuite();
  roleTestsSuite();
  userTestsSuite();
});
